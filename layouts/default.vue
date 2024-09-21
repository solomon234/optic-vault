<script setup lang="ts">
const links = [
  [{
    label: 'Home',
    icon: 'i-heroicons-home',
    to: '/'
  }, {
    label: 'Patients',
    icon: 'i-heroicons-user-plus',
    to: `/patients`
  }]
]

const colorMode = useColorMode()
const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})
</script>
<template>
  <div class="default">
    <UVerticalNavigation
        :links="links"
        :ui="{
      wrapper: 'border-s border-gray-200 dark:border-gray-800 space-y-2',
      base: 'group block border-s -ms-px leading-6 before:hidden',
      padding: '',
      rounded: '',
      font: '',
      ring: '',
      active: 'text-primary-500 dark:text-primary-400 border-current font-semibold',
      inactive: 'border-transparent hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300'
    }"
    >
      <template #default="{ link }">
        <span class="group-hover:text-primary relative">{{ link.label }}</span>
      </template>
    </UVerticalNavigation>
    <ClientOnly>
      <UButton
          :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
          color="gray"
          class="theme"
          variant="ghost"
          aria-label="Theme"
          @click="isDark = !isDark"
      />
      <template #fallback>
        <div class="w-8 h-8"/>
      </template>
    </ClientOnly>
    <UContainer>
      <slot/>
    </UContainer>
    <UNotifications/>
  </div>
</template>

<style scoped>
.theme {
  position: absolute;
  right: 0;
  top: 0;
}
</style>