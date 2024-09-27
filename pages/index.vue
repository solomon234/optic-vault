<script setup lang="ts">
import {format} from "date-fns";
import {object, string, number, type InferType, date} from 'yup'
import type {FormSubmitEvent} from '#ui/types'

const apiUrl = process.env.URL ? process.env.URL : 'http://localhost:3000/';

definePageMeta({
  layout: 'default'
})

const toast = useToast()
type Schema = InferType<typeof schema>
const loading = ref(false)
const selected = ref()

const schema = object({
  firstName: string().defined(),
  lastName: string().defined(),
  email: string().email('Invalid email').defined(),
  phoneNumber: string().matches(/^\(\d{3}\) \d{3}-\d{4}$/, 'Invalid Phone Number Ex. (123) 123-1234').defined(),
  birthDate: string().defined(),
})
let state = reactive({
  id: 0,
  hasPrism: false,
  firstName: undefined,
  lastName: undefined,
  phoneNumber: undefined,
  email: undefined,
  birthDate: undefined,
  address: undefined,
  // rx
  osSphere: '',
  osCylinder: '',
  osAxis: undefined,
  osAdd: undefined,
  osPD: undefined,
  osPrism: undefined,
  osBase: undefined,
  odSphere: '',
  odCylinder: '',
  odAxis: undefined,
  odAdd: undefined,
  odPD: undefined,
  odPrism: undefined,
  odBase: undefined,
  rxDate: format(new Date(), 'MM/dd/yyy'),
  comments: ''
})
const addValues = computed({
  get() {
    return generateAddValues(0.25, 20.00, 0.25)
  },
  set(val) {
  }
})
const rxValues = computed({
  get() {
    return generateAddValues(-20.00, 20.00, 0.25)
  },
  set(val) {
  }
})
const patientInfo = computed({
  get() {
    const tmpObj: any = {...state};
    return ['firstName', 'lastName', 'email', 'phoneNumber', 'birthDate', 'address', 'id']
        .map(key => {
          return {[key]: tmpObj[key]}
        }).reduce((acc, x) => acc = {...acc, ...x}, {});
  },
  set(val) {
  }
})
const rxInfo = computed({
  get() {
    const tmpObj: any = {...state};
    return ['osSphere', 'osCylinder', 'osAxis', 'osAdd', 'osPD', 'osPrism', 'osBase', 'odSphere', 'odCylinder', 'odAxis', 'odAdd', 'odPD', 'odPrism', 'odBase', 'rxDate', 'comments']
        .map(key => {
          return {[key]: tmpObj[key]}
        }).reduce((acc, x) => acc = {...acc, ...x}, {});
  },
  set(val) {
  }
})

// methods
function generateAddValues(min: number, max: number, step: number) {
  const values = [''];
  for (let i = min; i <= max; i += step) {
    values.push(i > 0 ? '+' + i.toFixed(2).toString() : i.toFixed(2).toString()); // Ensure the value has two decimal places
  }
  return values;
}

async function search(q: string) {
  loading.value = true

  const patients: any[] = await $fetch(apiUrl + 'api/patients', {params: {q}})
  loading.value = false

  return patients
}

function clearSelected() {
  console.log('clear')
  selected.value = undefined
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (!schema.isValidSync(state)) {
    toast.add({title: 'Errors found'})
    return
  }
  let id = state.id;

  try {
    if (id > 0) {
      await fetch(apiUrl + 'api/patients/' + id, {
        method: 'PUT',
        body: JSON.stringify(patientInfo.value)
      })
    }

    // Post new data
    if (id == 0) {
      const response = await fetch(apiUrl + 'api/patients', {
        method: 'POST',
        body: JSON.stringify(patientInfo.value)
      })
      id = await response.json();
      console.log('new ID', id);
    }

    await fetch(apiUrl + 'api/prescriptions/' + id, {
      method: 'POST',
      body: JSON.stringify(rxInfo.value)
    })
  } catch (error) {
    console.error(error)
  }
}

watch(selected, (newSelected) => {
  loading.value = true;
  if (!newSelected) {
    state = {
      ...state,
      firstName: undefined,
      lastName: undefined,
      birthDate: undefined,
      address: undefined,
      phoneNumber: undefined,
      email: undefined,
      id: 0
    }
    loading.value = false;
    return;
  }
  state = {
    ...state,
    ...newSelected,
    birthDate: format(new Date(newSelected.birthDate), 'MM/dd/yyy')
  }
  loading.value = false;
}, {deep: false});

</script>
<template>
  <UContainer>
    <UForm :state="state" class="space-y-4" @submit="onSubmit" :schema="schema" :loading="loading">
      <!-- Patient Information -->
      <h2> Patient Entry </h2>
      <UInputMenu
          v-model="selected"
          :search="search"
          :loading="loading"
          placeholder="Search for a user..."
          option-attribute="fullNameAndAddress"
          trailing
          by="id">
        <template #trailing>
          <UButton
              @click="clearSelected"
              color="gray"
              variant="link"
              icon="i-heroicons-x-mark-20-solid"
              :padded="false"
          />
        </template>
      </UInputMenu>
      <div class="grid grid-cols-2">
        <section class="w-9/12">
          <UFormGroup label="First Name" name="firstName">
            <UInput v-model="state.firstName" :loading="loading"/>
          </UFormGroup>
          <UFormGroup label="Last Name" name="lastName">
            <UInput v-model="state.lastName" :loading="loading"/>
          </UFormGroup>
          <UFormGroup label="Email" name="email">
            <UInput v-model="state.email" :loading="loading"/>
          </UFormGroup>
        </section>
        <section class="w-9/12">
          <UFormGroup label="Phone Number" name="phoneNumber">
            <UInput
                v-model="state.phoneNumber"
                v-mask="'(###) ###-####'"
                placeholder="(123) 123-1234"
                :loading="loading"/>

          </UFormGroup>
          <UFormGroup label="Date of Birth">
            <UInput v-model="state.birthDate" v-mask="'##/##/####'" placeholder="MM/DD/YYYY" :loading="loading"/>
          </UFormGroup>
          <UFormGroup label="Address">
            <UInput v-model="state.address" :loading="loading"/>
          </UFormGroup>
        </section>
      </div>
      <UDivider/>
      <h2>RX Entry</h2>
      <div class="grid " :class="state.hasPrism ? 'grid-cols-8' : 'grid-cols-5'">
        <UFormGroup label="Sphere (OD)" class="w-10/12">
          <UInputMenu
              v-model="state.odSphere"
              :options="rxValues"
          />
        </UFormGroup>
        <UFormGroup label="Cylinder (OD)" class="w-10/12">
          <UInputMenu
              v-model="state.odCylinder"
              :options="rxValues"
          />
        </UFormGroup>
        <UFormGroup label="Axis (OD)" class="w-10/12">
          <UInput
              type="number"
              v-model="state.odAxis"
              max="180"
              v-mask="'###'"
          />
        </UFormGroup>
        <UFormGroup label="Add (OD)" class="w-10/12">
          <UInputMenu
              :options="addValues"
              v-model="state.odAdd"
          />
        </UFormGroup>
        <UFormGroup label="PD (OD)" class="w-10/12">
          <UInput
              type="number"
              step="0.5"
              v-model="state.odPD"
          />
        </UFormGroup>
        <UFormGroup label="Prism (OD)" class="w-10/12" v-if="state.hasPrism">
          <UInput type="string" v-model="state.odPrism"/>
        </UFormGroup>
        <UFormGroup label="Base (OD)" class="w-10/12" v-if="state.hasPrism">
          <UInputMenu :options="['UP','DOWN','OUT','IN']" v-model="state.odBase"/>
        </UFormGroup>
      </div>
      <div class="grid " :class="state.hasPrism ? 'grid-cols-8' : 'grid-cols-5'">
        <UFormGroup label="Sphere (OS)" class="w-10/12">
          <UInputMenu
              v-model="state.osSphere"
              :options="rxValues"
          />
        </UFormGroup>
        <UFormGroup label="Cylinder (OS)" class="w-10/12">
          <UInputMenu
              v-model="state.osCylinder"
              :options="rxValues"
          />
        </UFormGroup>
        <UFormGroup label="Axis (OS)" class="w-10/12">
          <UInput
              type="number"
              v-model="state.osAxis"
              max="180"
              v-mask="'###'"
          />
        </UFormGroup>
        <UFormGroup label="Add (OS)" class="w-10/12">
          <UInputMenu
              :options="addValues"
              v-model="state.osAdd"
          />
        </UFormGroup>
        <UFormGroup label="PD (OS)" class="w-10/12">
          <UInput
              type="number"
              step="0.5"
              v-model="state.osPD"
          />
        </UFormGroup>
        <UFormGroup label="Prism (OS)" class="w-10/12" v-if="state.hasPrism">
          <UInput type="string" v-model="state.osPrism"/>
        </UFormGroup>
        <UFormGroup label="Base (OS)" class="w-10/12" v-if="state.hasPrism">
          <UInputMenu :options="['UP','DOWN','OUT','IN']" v-model="state.osBase"/>
        </UFormGroup>
      </div>
      <UFormGroup label="Rx Date" class="w-3/12">
        <UInput v-model="state.rxDate" v-mask="'##/##/####'" placeholder="MM/DD/YYYY" :loading="loading"/>
      </UFormGroup>
      <UCheckbox label="HasPrism?" v-model="state.hasPrism"></UCheckbox>
      <UFormGroup label="Comments">
        <UTextarea
            type="string"
        />
      </UFormGroup>

      <UButton
          label="Submit"
          @click="onSubmit"/>
    </UForm>
  </UContainer>
  <UNotifications/>
</template>


