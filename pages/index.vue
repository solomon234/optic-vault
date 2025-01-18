<script setup lang="ts">
import {format} from "date-fns";
import {object, string, type InferType} from 'yup'
import {useSetting} from "~/composables/useSetting";
import {usePatient} from "~/composables/usePatient";
import {useUtils} from "~/composables/useUtils";

const {generateAddValues} = useUtils();
definePageMeta({
  layout: 'default'
})

const toast = useToast();
type Schema = InferType<typeof schema>;
const loading = ref(false);
const selected = ref();
const tax = ref();

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
let state = ref({...blankPatient, orderTmp: {} as OrderDetail, tax: 0.0 as number})


// methods
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
  blankPatient.orders = [] as OrderDetail[];
  state.value = {...blankPatient, orderTmp: {} as OrderDetail, tax: 0.0 as number};
}

function addToOrder() {
  if (state.value.orderTmp.price === undefined) {
    toast.add({title: 'Price is required'})
    return
  }
  state.value.orders.push({...state.value.orderTmp, tax: state.value.tax || 0.0});
  clearOrderEntry();
}

function handleDateInput(e: any) {
  state.value.rx.rxDate = e.target.value;
}

async function clearOrderEntry() {
  state.value.orderTmp = {} as OrderDetail;
  state.value.tax = await useSetting().getTax() as number;
}

async function useLastRX() {
  loading.value = true;
  const lastRX = selected.value.prescriptions[0];
  state.value.rx = {
    ...lastRX,
    rxDate: format(new Date(lastRX.rxDate), 'MM/dd/yyy')
  }
  state.value.hasPrism = lastRX.odPrism || lastRX.osPrism;
  loading.value = false;
}

function validateSubmission() {
  if (!schema.isValidSync(state.value)) {
    toast.add({title: 'Errors found'})
    return false
  }

  if (state.value.orders.length === 0 && confirm('Are you sure you want to continue without order details?')) {
    return true
  } else {
    return false;
  }

}

async function onSubmit() {
  if (!validateSubmission()) {
    return
  }

  let id = state.value.id;
  let rxId = rxInfo.value.id;
  try {
    // Update existing data
    if (id > 0) {
      await usePatient().updatePatient(id.toString(), patientInfo.value);
    }
    // Post new data
    if (id == 0) {
      const response = await usePatient().addPatient(patientInfo.value);
      id = response;
      console.log('new ID', id);
    }
    // Post RX data
    if (rxInfo.id)
      await usePatient().updateRX(rxInfo.id, rxInfo.value);
    else {
      const response = await usePatient().addRX(id, rxInfo.value);
      rxId = response;
    }
    // Post Order data
    if (state.value.orders.length > 0) {
      const orderBody = {
        orderDetails: [...state.value.orders],
        patientId: id,
        prescriptionId: rxId
      }
      await usePatient().addOrders(id, orderBody);
    }
    clearSelected()
  } catch (error) {
    console.error(error)
  }
}

watch(selected, (newSelected) => {
  loading.value = true;
  state.value = {...blankPatient, orderTmp: {} as OrderDetail, tax: tax.value};
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
  tax.value = await useSetting().getTax() as number;
  state.value.tax = tax.value;
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
        <div class="grid grid-cols-3 gap-4">
          <section>
            <UFormGroup name="firstName" class="mb-4">
              <div class="flex items-center space-x-2">
                <span class="w-24 text-right">First Name:</span>
                <UInput v-model="state.firstName" :loading="loading" size="2xs" class="flex-1"/>
              </div>
            </UFormGroup>
            <UFormGroup name="lastName" class="mb-4">
              <div class="flex items-center space-x-2">
                <span class="w-24 text-right">Last Name:</span>
                <UInput v-model="state.lastName" :loading="loading" size="2xs" class="flex-1"/>
              </div>
            </UFormGroup>
          </section>
          <section>
            <UFormGroup name="email" class="mb-4">
              <div class="flex items-center space-x-2">
                <span class="w-24 text-right">Email:</span>
                <UInput v-model="state.email" :loading="loading" size="2xs" class="flex-1"/>
              </div>
            </UFormGroup>
            <UFormGroup name="phoneNumber" class="mb-4">
              <div class="flex items-center space-x-2">
                <span class="w-24 text-right">Phone #:</span>
                <UInput
                    v-model="state.phoneNumber"
                    v-mask="'(###) ###-####'"
                    placeholder="(123) 123-1234"
                    :loading="loading"
                    size="2xs"
                    class="flex-1"
                />
              </div>
            </UFormGroup>
          </section>
          <section>
            <UFormGroup class="mb-4">
              <div class="flex items-center space-x-2">
                <span class="w-24 text-right">Date of Birth:</span>
                <UInput
                    v-model="state.birthDate"
                    v-mask="'##/##/####'"
                    placeholder="MM/DD/YYYY"
                    :loading="loading"
                    size="2xs"
                    class="flex-1"
                />
              </div>
            </UFormGroup>
            <UFormGroup class="mb-4">
              <div class="flex items-center space-x-2">
                <span class="w-24 text-right">Address:</span>
                <UInput v-model="state.address" :loading="loading" size="2xs" class="flex-1"/>
              </div>
            </UFormGroup>
          </section>
        </div>
        <UDivider label="Prescription Section" size='lg'/>
        <UButton label="Use Last RX" @click="useLastRX" v-if="patientInfo.prescriptions"/>
        <UFormGroup class="w-3/12">
          <div class="flex items-center space-x-2">
            <span class="w-24 text-right">RX Date:</span>
            <UInput v-model="state.rx.rxDate"
                    :value="formattedDate"
                    @input="handleDateInput"
                    v-mask="'##/##/####'"
                    placeholder="MM/DD/YYYY"
                    type="text"
                    :loading="loading"
                    size="2xs"
                    class="flex-1"/>
          </div>

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
        <UDivider label="Order Section" size="lg"/>
        <div class="grid"
             :class="['Lens','Frame'].includes(state.orderTmp.productType) ? 'grid-cols-5' : 'grid-cols-4'">
          <UFormGroup class="w-11/12">
            <div class="flex items-center space-x-2">
              <span class="w-24 text-right">Type:</span>
              <UInputMenu v-model="state.orderTmp.productType" :options="['Exam', 'Lens', 'Frame','Add Ons']"
                          :loading="loading"
                          size="2xs"
                          class="flex-1"/>
            </div>
          </UFormGroup>
          <div v-if="state.orderTmp.productType === 'Frame'">
            <UFormGroup class="w-11/12">
              <div class="flex items-center space-x-2">
                <span class="w-24 text-right">Frame:</span>
                <UInput v-model="state.orderTmp.frame" :loading="loading" size="2xs" class="flex-1"/>
              </div>
            </UFormGroup>
          </div>
          <div v-if="state.orderTmp.productType === 'Lens'">
            <UFormGroup class="w-11/12">
              <div class="flex items-center space-x-2">
                <span class="w-24 text-right">Lens Type:</span>
                <UInputMenu v-model="state.orderTmp.lens" :loading="loading"
                            :options="['Single Vision', 'Bifocal', 'Progressive']"
                            size="2xs"
                            class="flex-1"/>
              </div>
            </UFormGroup>
          </div>
          <UFormGroup class="w-12/12">
            <div class="flex items-center space-x-2">
              <span class="text-right">Description:</span>
              <UTextarea v-model="state.orderTmp.description" :loading="loading" size="2xs" rows=1 autoresize/>
            </div>
          </UFormGroup>
          <UFormGroup class="w-11/12">
            <div class="flex items-center space-x-2">
              <span class="w-24 text-right">Price:</span>
              <UInput v-model="state.orderTmp.price" :loading="loading" size="2xs" type="number" class="flex-1"/>
            </div>
          </UFormGroup>
          <UFormGroup class="w-11/12">
            <div class="flex items-center space-x-2">
              <span class="w-24 text-right">Tax:</span>
              <UInput v-model="state.tax" :loading="loading" size="2xs" class="flex-1" type="number"/>
            </div>
          </UFormGroup>
        </div>
        <UFormGroup class="flex justify-end">
          <UButton class="m-3 right-0"
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
                    Tax: ${{ item.tax || item.tax.toFixed(2) }}
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

<style scoped>
.baseline {
  align-items: baseline;
}
</style>