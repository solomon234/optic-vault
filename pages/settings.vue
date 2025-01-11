<script setup lang="ts">
import {useSetting} from "~/composables/useSetting";

let state: any = reactive([]);
let loading = ref(true);

const updateSetting = (type: string) => {
  useSetting().updateSettings(type, state[type]);
}

onMounted(async () => {
  state = await useSetting().getSettings();
  loading.value = false
})
</script>

<template>
  <div class="w-full">
    <h1>Settings</h1>
    <UDivider/>
    <template>
      <UFormGroup v-for="setting in state" :label="setting.type">
        <LazyUInput v-model="setting.value" type="number" @blur="updateSetting(setting.type)"/>
      </UFormGroup>
    </template>
  </div>
</template>

<style scoped>

</style>