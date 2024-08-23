<template>
  <div>
    <h1>Patients List</h1>
    <table>
      <thead>
      <tr>
        <th>ID</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Phone</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="patient in patients" :key="patient.id">
        <td><button></button></td>
        <td>{{ patient.id }}</td>
        <td>{{ patient.first_name }}</td>
        <td>{{ patient.last_name }}</td>
        <td>{{ patient.phone_number }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">

import type Patient from "~/server/api/model/patient";

const patients = ref<Patient[]>([]);

const fetchPatients = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/patients'); // Ensure this endpoint matches your API
    const body: Patient[] | any = await response.json();
    patients.value = [...body];
  } catch (error) {
    console.error('Error fetching patients:', error);
  }
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString();
};

onMounted(fetchPatients);
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}
</style>