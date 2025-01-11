<script setup lang="ts">
import {format} from "date-fns";
import {object, string, type InferType} from 'yup'
import {useSetting} from "~/composables/useSetting";

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
const addValues = computed({
  get() {
    return generateAddValues(0.25, 20.00, 0.25)
  },
  set() {
  }
})
const rxValues = computed({
  get() {
    return generateAddValues(-20.00, 20.00, 0.25)
  },
  set() {
  }
})
const patientInfo = computed({
  get() {
    const tmpObj: any = {...state.value};
    return ['firstName', 'lastName', 'email', 'phoneNumber', 'birthDate', 'address', 'id']
        .map(key => {
          return {[key]: tmpObj[key]}
        }).reduce((acc, x) => acc = {...acc, ...x}, {});
  },
  set() {
  }
})
const rxInfo = computed({
  get() {
    const tmpObj: any = {...state.value};
    return ['osSphere', 'osCylinder', 'osAxis', 'osAdd', 'osPD', 'osPrism', 'osBase', 'odSphere', 'odCylinder', 'odAxis', 'odAdd', 'odPD', 'odPrism', 'odBase', 'rxDate', 'comments']
        .map(key => {
          return {[key]: tmpObj[key]}
        }).reduce((acc, x) => acc = {...acc, ...x}, {});
  },
  set() {
  }
})
const totalPrice = computed({
  get() {
    return state.value.orders.reduce((acc, x) => acc += x.price * (1 + (x.tax / 100)), 0);
  },
  set() {
  }
})
const examDetails = computed({
  get() {
    return state.value.orders.filter((e) => e.productType === 'Exam');
  },
  set() {
  }
})
const frameDetails = computed({
  get() {
    return state.value.orders.filter((e) => e.productType === 'Frame');
  },
  set() {
  }
})
const lensDetails = computed({
  get() {
    return state.value.orders.filter((e) => e.productType === 'Lens');
  },
  set() {
  }
})
const blankPatient: Patient = {
  id: 0,
  hasPrism: false,
  firstName: '',
  lastName: '',
  phoneNumber: '',
  email: '',
  birthDate: '',
  address: '',
  rx: {
    osSphere: undefined,
    osCylinder: undefined,
    osAxis: undefined,
    osAdd: undefined,
    osPD: undefined,
    osPrism: undefined,
    osBase: undefined,
    odSphere: undefined,
    odCylinder: undefined,
    odAxis: undefined,
    odAdd: undefined,
    odPD: undefined,
    odPrism: undefined,
    odBase: undefined,
    rxDate: format(new Date(), 'MM/dd/yyy'),
    comments: ''
  },
  orders: [],
}
const items = [{
  key: 'rxEntry',
  label: 'RX Entry',
  description: 'Enter the patient\'s prescription here.'
}, {
  key: 'orderEntry',
  label: 'Order entry',
  description: 'Enter the patient\'s order information here.'
}]

let state = ref({...blankPatient, orderTmp: {} as Order, tax: 0.0 as number})


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

function searchRX(q: string) {
  loading.value = true
  const val = rxValues.value.filter(e => e.includes(q));
  loading.value = false
  return val;
}

function searchAdd(q: string) {
  loading.value = true
  const val = addValues.value.filter(e => e.includes(q));
  loading.value = false
  return val;
}

function clearSelected() {
  console.log('clear');
  selected.value = undefined;
  state.value = {...blankPatient};
}

function addToOrder() {
  state.value.orders.push({...state.value.orderTmp, tax: state.value.tax || 0.0});
  clearOrderEntry();
}

async function clearOrderEntry() {
  state.value.orderTmp = {};
  state.value.tax = await useSetting().getTax() as number;
}

async function useLastRX() {
  const lastRX = selected.value.prescriptions[selected.value.prescriptions.length - 1];
  state.value = {
    ...state.value,
    ...lastRX,
    rxDate: format(new Date(lastRX.rxDate), 'MM/dd/yyy')
  }
}

async function onSubmit() {
  if (!schema.isValidSync(state.value)) {
    toast.add({title: 'Errors found'})
    return
  }
  let id = state.value.id;

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
    clearSelected()
  } catch (error) {
    console.error(error)
  }
}

watch(selected, (newSelected) => {
  loading.value = true;
  state.value = {...blankPatient, orderTmp: {} as Order, tax: 0.0};
  if (!newSelected) {
    loading.value = false;
    return;
  }
  state.value = {
    ...state.value,
    ...newSelected,
    birthDate: format(new Date(newSelected.birthDate), 'MM/dd/yyy')
  }
  loading.value = false;
}, {deep: true});

onMounted(async () => {
  state.value.tax = await useSetting().getTax() as number;
})

</script>
<template>
  <UContainer class="w-full">
    <UForm :state="state" class="space-y-4" @submit="onSubmit" :schema="schema" :loading="loading">
      <!-- Patient Information -->
      <h2> Patient Entry </h2>
      <UInputMenu
          v-model="selected"
          :search="search"
          :loading="loading"
          placeholder="Search for a patient..."
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
      <UTabs :items="items" class="w-full">
        <template #item="{item}">
          <div v-if="item.key === 'rxEntry'">
            <UButton label="Use Last RX" @click="useLastRX"/>
            <UFormGroup label="Rx Date" class="w-3/12">
              <UInput v-model="state.rx.rxDate" v-mask="'##/##/####'" placeholder="MM/DD/YYYY" :loading="loading"/>
            </UFormGroup>
            <div class="grid " :class="state.hasPrism ? 'grid-cols-8' : 'grid-cols-5'">
              <UFormGroup label="Sphere (OD)" class="w-10/12">
                <UInputMenu
                    v-model="state.odSphere"
                    :search="searchRX"
                    :loading="loading"
                    nullable
                />
              </UFormGroup>
              <UFormGroup label="Cylinder (OD)" class="w-10/12">
                <UInputMenu
                    v-model="state.odCylinder"
                    :search="searchRX"
                    :loading="loading"
                    nullable
                />
              </UFormGroup>
              <UFormGroup label="Axis (OD)" class="w-10/12">
                <UInput
                    type="number"
                    v-model="state.odAxis"
                    max="180"
                    :loading="loading"
                    nullable
                />
              </UFormGroup>
              <UFormGroup label="Add (OD)" class="w-10/12">
                <UInputMenu
                    :search="searchAdd"
                    v-model="state.odAdd"
                    :loading="loading"
                    nullable
                />
              </UFormGroup>
              <UFormGroup label="PD (OD)" class="w-10/12">
                <UInput
                    type="number"
                    step="0.5"
                    v-model="state.odPD"
                    :loading="loading"
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
                    :search="searchRX"
                    :loading="loading"
                    nullable
                />
              </UFormGroup>
              <UFormGroup label="Cylinder (OS)" class="w-10/12 h-5">
                <UInputMenu
                    v-model="state.osCylinder"
                    :search="searchRX"
                    :loading="loading"
                    nullable
                />
              </UFormGroup>
              <UFormGroup label="Axis (OS)" class="w-10/12">
                <UInput
                    type="number"
                    v-model="state.osAxis"
                    max="180"
                    :loading="loading"
                    nullable
                />
              </UFormGroup>
              <UFormGroup label="Add (OS)" class="w-10/12">
                <UInputMenu
                    :search="searchAdd"
                    v-model="state.osAdd"
                    :loading="loading"
                    nullable
                />
              </UFormGroup>
              <UFormGroup label="PD (OS)" class="w-10/12">
                <UInput
                    type="number"
                    step="0.5"
                    v-model="state.osPD"
                    :loading="loading"
                    nullable
                />
              </UFormGroup>
              <UFormGroup label="Prism (OS)" class="w-10/12" v-if="state.hasPrism">
                <UInput type="string" v-model="state.osPrism"/>
              </UFormGroup>
              <UFormGroup label="Base (OS)" class="w-10/12" v-if="state.hasPrism">
                <UInputMenu :options="['UP','DOWN','OUT','IN']" v-model="state.osBase"/>
              </UFormGroup>
            </div>
            <UCheckbox label="HasPrism?" v-model="state.hasPrism"></UCheckbox>
            <UFormGroup label="Comments">
              <UTextarea
                  type="string"
                  v-model="state.rx.comments"
              />
            </UFormGroup>

          </div>
          <div v-if="item.key === 'orderEntry'">
            <div class=" grid grid-cols-4">
              <UFormGroup label="Type" class="w-10/12">
                <UInputMenu v-model="state.orderTmp.productType" :options="['Exam', 'Lens', 'Frame']"
                            :loading="loading"/>
              </UFormGroup>
              <div v-if="state.orderTmp.productType === 'Frame'">
                <UFormGroup label="Frame" class="w-10/12">
                  <UInput v-model="state.orderTmp.frame" :loading="loading"/>
                </UFormGroup>
              </div>
              <div v-if="state.orderTmp.productType === 'Lens'">
                <UFormGroup label="Lens Type" class="w-10/12">
                  <UInputMenu v-model="state.orderTmp.lens" :loading="loading"
                              :options="['Single Vision', 'Bifocal', 'Progressive']"/>
                </UFormGroup>
              </div>
              <UFormGroup label="Description" class="w-10/12">
                <UInput v-model="state.orderTmp.description" :loading="loading"/>
              </UFormGroup>
              <UFormGroup label="Price" class="w-10/12">
                <UInput v-model="state.orderTmp.price" :loading="loading"/>
              </UFormGroup>
              <UFormGroup label="Tax" class="w-10/12">
                <UInput v-model="state.tax" :loading="loading"/>
              </UFormGroup>
            </div>
            <UFormGroup class="w-10/12">
              <UButton class="m-3"
                       @click="addToOrder">
                Add to order
              </UButton>
              <UButton class="m-3" @click="clearOrderEntry" color="red">
                Clear
              </UButton>
            </UFormGroup>
            <UFormGroup label="Order Summary">
              <div v-if="state.orders.length">
                <span v-if="examDetails.length"> Exam Summary</span>
                <div v-for="(exam, index) in examDetails">
                  {{ exam.description }} - ${{ exam.price }} (Tax: ${{ exam.tax }})
                </div>
                <UDivider/>
                <span v-if="frameDetails.length"> Frames: </span>
                <div v-for="(frame, index) in frameDetails">
                  {{ frame.description }} - ${{ frame.price }} (Tax: ${{ frame.tax }})
                </div>
                <UDivider/>
                <span v-if="lensDetails.length"> Lens: </span>
                <div v-for="(lens, index) in lensDetails">
                  {{ lens.type }} {{ lens.description }} - ${{ lens.price }} (Tax: ${{ lens.tax }})
                  <UButton color="red">
                    Remove
                  </UButton>
                </div>
                <p>Total: ${{ totalPrice.toFixed(2) }}</p>
              </div>
            </UFormGroup>
          </div>
        </template>
      </UTabs>

      <UButton
          label="Submit"
          @click="onSubmit"/>
    </UForm>
  </UContainer>
  <UNotifications/>
</template>