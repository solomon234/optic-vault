<script setup lang="ts">

import type Patient from "~/server/api/model/patient";
import type {UnwrapRef} from "vue";
import {format} from "date-fns";

const isOpen = ref(false)
let selected = ref({});

const columns = [
  {
    key: "firstName",
    label: "First Name",
  }, {
    key: "lastName",
    label: "Last Name",
  }, {
    key: "email",
    label: "Email",
  }, {
    key: "phoneNumber",
    label: "Phone Number",
  }, {
    key: "birthDate",
    label: "Date of Birth",
  },
  {key: "actions"}
]
const items = (row: any) => [
  [{
    label: 'View RX History',
    icon: 'i-heroicons-list-bullet-20-solid',
    click: () => {
      selected = row;
      isOpen.value = true
    }
  }, {
    label: 'Delete',
    icon: 'i-heroicons-trash-20-solid',
    click: async () => {
      await fetch(apiUrl + 'api/patients/' + row.id, {
        method: 'DELETE',
      })
      fetchPatients()
    }
  }]
]

const apiUrl = process.env.URL ? process.env.URL : 'http://localhost:3000/';
const toast = useToast()
let patients: Ref<UnwrapRef<any[]>> = ref([]);

const q = ref('');

const fetchPatients = async () => {
  try {
    const response = await fetch(apiUrl + 'api/patients'); // Ensure this endpoint matches your API
    const body: Patient[] | any = await response.json();
    patients.value = [...body];
  } catch (error) {
    toast.add({title: 'Errors found'})
    console.error('Error fetching patients:', error);
  }
};
const deleteRX = async (rx: object, index: int) => {
  await fetch(apiUrl + 'api/prescriptions/' + rx.id, {
    method: 'DELETE',
  })
  selected.prescriptions.splice(index, 1)
}

const filteredRows = computed(() => {
  if (!q.value) {
    return patients.value
  }

  return patients.value.filter((patient) => {
    return Object.values(patient).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase())
    })
  })
})

onMounted(fetchPatients)
</script>

<template>
  <div>
    <h1>Patients List</h1>
    <div class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
      <UInput v-model="q" placeholder="Filter patient..."/>
    </div>
    <UTable :columns="columns" :rows="filteredRows">
      <template #actions-data="{ row }">
        <UDropdown :items="items(row)">
          <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid"/>
        </UDropdown>
      </template>
    </UTable>
    <UModal v-model="isOpen" fullscreen>
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              RX History
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                     @click="isOpen = false"/>
          </div>
        </template>
      </UCard>
      <UCard
          v-for="(prescription, index) in selected.prescriptions"
          :key="index"
          class="prescription-card"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <span>Prescription - {{ format(new Date(prescription.rxDate), 'MM/dd/yyy') }}</span>
            <UButton class="bg-red-600" @click="deleteRX(prescription, index)">Delete</UButton>
          </div>
        </template>
        <template #default>
          <div class="rx-details">
            <table class="prescription-table">
              <thead>
              <tr>
                <th></th>
                <th></th>
                <th>Sphere</th>
                <th>Cylinder</th>
                <th>Axis</th>
                <th>Prism</th>
                <th>Base</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td :rowspan="2">DISTANCE</td>
                <td>OD</td>
                <td>{{ prescription.odSphere }}</td>
                <td>{{ prescription.odCylinder }}</td>
                <td>{{ prescription.odAxis }}</td>
                <td>{{ prescription.odPrism }}</td>
                <td>{{ prescription.odBase }}</td>
              </tr>
              <tr>
                <td>OS</td>
                <td>{{ prescription.osSphere }}</td>
                <td>{{ prescription.osCylinder }}</td>
                <td>{{ prescription.osAxis }}</td>
                <td>{{ prescription.osPrism }}</td>
                <td>{{ prescription.osBase }}</td>
              </tr>
              <tr>
                <td :rowspan="2">ADD</td>
                <td>OD</td>
                <td>{{ prescription.odAdd }}</td>
                <td :colspan="4"></td>
              </tr>
              <tr>
                <td>OS</td>
                <td>{{ prescription.osAdd }}</td>
                <td :colspan="4"></td>
              </tr>
              </tbody>
            </table>
            Comments: {{ prescription.comments }}
          </div>
        </template>
      </UCard>
      <span v-if="selected.prescriptions.length === 0" class="text-center">No Data</span>
    </UModal>
  </div>
</template>
<style scoped>

.prescription-table {
  width: 100%;
  border-collapse: collapse;
}

.prescription-table th,
.prescription-table td {
  @apply border border-gray-400 px-4 py-2 text-center;
}

.prescription-table th {
  @apply bg-gray-200 dark:bg-gray-800;
}

.dark .prescription-table th,
.dark .prescription-table td {
  @apply border-gray-600;
}
</style>