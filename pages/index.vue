<script setup lang="ts">
import {format} from "date-fns";
import {object, string, type InferType} from 'yup'
import {useSetting} from "~/composables/useSetting";
import {usePatient} from "~/composables/usePatient";
import {DialogWrapper} from "vue3-promise-dialog"

definePageMeta({
  layout: 'default'
})

const toast = useToast();
type Schema = InferType<typeof schema>;
const loading = ref(false);
const selected = ref();

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
    return ['firstName', 'lastName', 'email', 'phoneNumber', 'birthDate', 'address', 'id', 'prescriptions']
        .map(key => {
          return {[key]: tmpObj[key]}
        }).reduce((acc, x) => acc = {...acc, ...x}, {});
  },
  set() {
  }
})
const rxInfo = computed({
  get() {
    return state.value.rx;
  },
  set() {
  }
})
const hasPrism = computed({
  get() {
    return rxInfo.odPrism || rxInfo.osPrism || state.value.hasPrism;
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
const orderDetails = computed({
  get() {
    return state.value.orders;
  },
  set() {
  }
})
const formattedDate = computed({
  get() {
    return format(new Date(state.value.rx.rxDate), 'MM/dd/yyy')
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
},
  {
    key: 'orderEntry',
    label: 'Order Entry',
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
  try {
    return await usePatient().getPatients({params: {q}});
  } catch (error) {
    return [];
  } finally {
    loading.value = false;
  }
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
  state.value = {...blankPatient, orderTmp: {} as Order, tax: 0.0 as number};
}

function addToOrder() {
  state.value.orders.push({...state.value.orderTmp, tax: state.value.tax || 0.0});
  clearOrderEntry();
}

function handleDateInput(e: any) {
  state.value.rx.rxDate = e.target.value;
}

async function clearOrderEntry() {
  state.value.orderTmp = {} as Order;
  state.value.tax = await useSetting().getTax() as number;
}

async function useLastRX() {
  loading.value = true;
  const lastRX = selected.value.prescriptions[selected.value.prescriptions.length - 1];
  state.value.rx = {
    ...lastRX,
    rxDate: format(new Date(lastRX.rxDate), 'MM/dd/yyy')
  }
  state.value.hasPrism = lastRX.odPrism || lastRX.osPrism;
  loading.value = false;
}

async function validateSubmission() {
  let res = false;
  if (!schema.isValidSync(state.value)) {
    toast.add({title: 'Errors found'})
    return res
  }

  if (state.value.orders.length === 0) {
    if (await confirmation("Warning", "Are you sure you want to continue without order details?")) {
      res = true;
    }
    return res
  }
  return true
}

async function onSubmit() {
  if (await !validateSubmission())
    return

  let id = state.value.id;
  try {
    if (id > 0) {
      await usePatient().updatePatient(id.toString(), patientInfo);
    }
    // Post new data
    if (id == 0) {
      const response = await usePatient().addPatient(patientInfo);
      id = await response;
      console.log('new ID', id);
    }
    await usePatient().addRX(id, rxInfo.value);
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
  <div class="w-full">
    <UContainer>
      <UForm :state="state" class="space-y-4" @submit="onSubmit" :schema="schema" :loading="loading">
        <!-- Patient Information -->
        <h2> Patient Entry </h2>
        <UInputMenu
            v-model.lazy="selected"
            :search="search"
            :loading="loading"
            placeholder="Search for a patient..."
            option-attribute="fullNameAndAddress"
            trailing
            by="id"
            size="2xs">
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
              <UInput v-model="state.firstName" :loading="loading" size="2xs"/>
            </UFormGroup>
            <UFormGroup label="Last Name" name="lastName">
              <UInput v-model="state.lastName" :loading="loading" size="2xs"/>
            </UFormGroup>
            <UFormGroup label="Email" name="email">
              <UInput v-model="state.email" :loading="loading" size="2xs"/>
            </UFormGroup>
          </section>
          <section class="w-9/12">
            <UFormGroup label="Phone Number" name="phoneNumber">
              <UInput
                  v-model="state.phoneNumber"
                  v-mask="'(###) ###-####'"
                  placeholder="(123) 123-1234"
                  :loading="loading"
                  size="2xs"/>

            </UFormGroup>
            <UFormGroup label="Date of Birth">
              <UInput v-model="state.birthDate" v-mask="'##/##/####'" placeholder="MM/DD/YYYY" :loading="loading"
                      size="2xs"/>
            </UFormGroup>
            <UFormGroup label="Address">
              <UInput v-model="state.address" :loading="loading" size="2xs"/>
            </UFormGroup>
          </section>
        </div>
        <UDivider/>
        <UTabs :items="items" class="w-full">
          <template #item="{item}">
            <div v-if="item.key === 'rxEntry'">
              <UButton label="Use Last RX" @click="useLastRX" v-if="patientInfo.prescriptions"/>
              <UFormGroup label="Rx Date" class="w-3/12">
                <UInput v-model="state.rx.rxDate"
                        :value="formattedDate"
                        @input="handleDateInput"
                        v-mask="'##/##/####'"
                        placeholder="MM/DD/YYYY"
                        type="text"
                        :loading="loading"
                        size="2xs"/>
              </UFormGroup>
              <div class="grid " :class="hasPrism ? 'grid-cols-8' : 'grid-cols-5'">
                <UFormGroup label="Sphere (OD)" class="w-10/12">
                  <UInputMenu
                      v-model="state.rx.odSphere"
                      :search="searchRX"
                      :loading="loading"
                      nullable
                      size="2xs"
                  />
                </UFormGroup>
                <UFormGroup label="Cylinder (OD)" class="w-10/12">
                  <UInputMenu
                      v-model="state.rx.odCylinder"
                      :search="searchRX"
                      :loading="loading"
                      nullable
                      size="2xs"
                  />
                </UFormGroup>
                <UFormGroup label="Axis (OD)" class="w-10/12">
                  <UInput
                      type="number"
                      v-model="state.rx.odAxis"
                      max="180"
                      :loading="loading"
                      nullable
                      size="2xs"
                  />
                </UFormGroup>
                <UFormGroup label="Add (OD)" class="w-10/12">
                  <UInputMenu
                      :search="searchAdd"
                      v-model="state.rx.odAdd"
                      :loading="loading"
                      nullable
                      size="2xs"
                  />
                </UFormGroup>
                <UFormGroup label="PD (OD)" class="w-10/12">
                  <UInput
                      type="number"
                      step="0.5"
                      v-model="state.rx.odPD"
                      :loading="loading"
                      size="2xs"
                  />
                </UFormGroup>
                <UFormGroup label="Prism (OD)" class="w-10/12" v-if="hasPrism">
                  <UInput type="string" v-model="state.rx.odPrism" size="2xs"/>
                </UFormGroup>
                <UFormGroup label="Base (OD)" class="w-10/12" v-if="hasPrism">
                  <UInputMenu :options="['UP','DOWN','OUT','IN']" v-model="state.rx.odBase" size="2xs"/>
                </UFormGroup>
              </div>
              <div class="grid " :class="hasPrism ? 'grid-cols-8' : 'grid-cols-5'">
                <UFormGroup label="Sphere (OS)" class="w-10/12">
                  <UInputMenu
                      v-model="state.rx.osSphere"
                      :search="searchRX"
                      :loading="loading"
                      nullable
                      size="2xs"
                  />
                </UFormGroup>
                <UFormGroup label="Cylinder (OS)" class="w-10/12 h-5">
                  <UInputMenu
                      v-model="state.rx.osCylinder"
                      :search="searchRX"
                      :loading="loading"
                      nullable
                      size="2xs"
                  />
                </UFormGroup>
                <UFormGroup label="Axis (OS)" class="w-10/12">
                  <UInput
                      type="number"
                      v-model="state.rx.osAxis"
                      max="180"
                      :loading="loading"
                      nullable
                      size="2xs"
                  />
                </UFormGroup>
                <UFormGroup label="Add (OS)" class="w-10/12">
                  <UInputMenu
                      :search="searchAdd"
                      v-model="state.rx.osAdd"
                      :loading="loading"
                      nullable
                      size="2xs"
                  />
                </UFormGroup>
                <UFormGroup label="PD (OS)" class="w-10/12">
                  <UInput
                      type="number"
                      step="0.5"
                      v-model="state.rx.osPD"
                      :loading="loading"
                      nullable
                      size="2xs"
                  />
                </UFormGroup>
                <UFormGroup label="Prism (OS)" class="w-10/12" v-if="hasPrism">
                  <UInput type="string" v-model="state.rx.osPrism" size="2xs"/>
                </UFormGroup>
                <UFormGroup label="Base (OS)" class="w-10/12" v-if="hasPrism">
                  <UInputMenu :options="['UP','DOWN','OUT','IN']" v-model="state.rx.osBase" size="2xs"/>
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
                  <UInputMenu v-model="state.orderTmp.productType" :options="['Exam', 'Lens', 'Frame','Add Ons']"
                              :loading="loading"
                              size="2xs"/>
                </UFormGroup>
                <div v-if="state.orderTmp.productType === 'Frame'">
                  <UFormGroup label="Frame" class="w-10/12">
                    <UInput v-model="state.orderTmp.frame" :loading="loading" size="2xs"/>
                  </UFormGroup>
                </div>
                <div v-if="state.orderTmp.productType === 'Lens'">
                  <UFormGroup label="Lens Type" class="w-10/12">
                    <UInputMenu v-model="state.orderTmp.lens" :loading="loading"
                                :options="['Single Vision', 'Bifocal', 'Progressive']"
                                size="2xs"/>
                  </UFormGroup>
                </div>
                <UFormGroup label="Description" class="w-10/12">
                  <UInput v-model="state.orderTmp.description" :loading="loading" size="2xs"/>
                </UFormGroup>
                <UFormGroup label="Price" class="w-10/12">
                  <UInput v-model="state.orderTmp.price" :loading="loading" size="2xs" type="number"/>
                </UFormGroup>
                <UFormGroup label="Tax" class="w-10/12">
                  <UInput v-model="state.tax" :loading="loading" size="2xs"/>
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
              <UCard>
                <template #header>
                  <div class="flex justify-between items-center">
                    <h3 class="text-lg font-semibold">Order Summary</h3>
                  </div>
                </template>

                <div class="space-y-4" v-if="orderDetails.length">
                  <div
                      v-for="(item, index) in orderDetails"
                      :key="index"
                      class="flex items-center justify-between p-3 rounded-lg border-b-4"
                  >
                    <div class="flex-1">
                      <span class="font-medium">{{ item.productType }}</span>
                      <span class="mx-2 text-gray-400">|</span>
                      <span class="text-gray-600">{{ item.frame ? item.frame + ' ' : '' }}{{ item.description }}</span>
                    </div>
                    <div class="flex items-center gap-4">
                      <div class="text-right">
                        <div class="font-medium">${{ item.price }}</div>
                        <div class="text-sm text-gray-500">
                          Tax: ${{ item.tax.toFixed(2) }}
                        </div>
                      </div>
                      <UButton
                          color="red"
                          variant="soft"
                          :icon="'i-heroicons-trash'"
                      />
                    </div>
                  </div>
                </div>

                <template #footer>
                  <div class="flex justify-between items-center w-full pt-4">
                    <div class="text-lg font-semibold">Total</div>
                    <div class="text-xl font-bold">${{ totalPrice.toFixed(2) }}</div>
                  </div>
                </template>
              </UCard>
            </div>
          </template>
        </UTabs>

        <UButton
            label="Submit"
            @click="onSubmit"/>
        <UButton label="Clear" color="red" @click="clearSelected" class="m-3"/>
      </UForm>
    </UContainer>
    <UNotifications/>
    <DialogWrapper/>
  </div>
</template>