<script setup lang="ts">

import type Patient from "~/server/api/model/patient";
import type {UnwrapRef} from "vue";

const columns = [
  {
    key: 'delete',
    label: 'x',
  }, {
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
  }
]
let patients: Ref<UnwrapRef<any[]>> = ref([]);
const apiUrl = process.env.URL ? process.env.URL : 'http://localhost:3000/';

const q = ref('');

const fetchPatients = async () => {
  try {
    const response = await fetch(apiUrl + 'api/patients'); // Ensure this endpoint matches your API
    const body: Patient[] | any = await response.json();
    patients.value = [...body];
  } catch (error) {
    console.error('Error fetching patients:', error);
  }
};

const filteredRows = computed(() => {
  if (!q.value) {
    fetchPatients()
    return patients
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
    <UTable :columns="columns" :rows="filteredRows"/>
  </div>
</template>

