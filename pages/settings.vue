<script setup lang="ts">
import {useSetting} from "~/composables/useSetting";

const settings = ref([]);

const updateSetting = (index: number) => {
  const setting = settings.value[index];
  useSetting().updateSettings(setting.type, setting.value);
};

function isNumeric(value: any) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

onMounted(async () => {
  settings.value = await useSetting().getSettings();
});
</script>

<template>
  <div class="settings-container">
    <h1 class="settings-title">Settings</h1>
    <UDivider class="settings-divider"/>
    <div class="settings-list">
      <div v-for="(setting, index) in settings" :key="setting.type" class="setting-item">
        <label class="flex-1">{{ setting.type }}</label>
        <div class="setting-input-wrapper">
          <UInput v-if="isNumeric(setting.value)" v-model.lazy="setting.value" type="number"
                  @blur="updateSetting(index)" class="setting-input"/>
          <UInput v-else v-model.lazy="setting.value" @blur="updateSetting(index)" class="setting-input"/>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

.settings-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.settings-divider {
  margin-bottom: 2rem;
}

.settings-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-radius: 8px;
}


.setting-input-wrapper {
  flex: 2;
}

.setting-input {
  width: 100%;
}

</style>