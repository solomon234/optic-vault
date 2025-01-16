<script setup lang="ts">
const links = [
  [{
    label: 'Home',
    icon: 'i-heroicons-home',
    to: '/',
    

  }, {
    label: 'Patients',
    icon: 'i-heroicons-user-plus',
    to: `/patients`
  },
    {
      label: 'Settings',
      icon: 'i-heroicons-cog',
      to: `/settings`
    }
  ]
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
  <div class="default inset-0 flex overflow-hidden" id="container">
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
    <UVerticalNavigation
        :links="links"

    >
      <template #default="{ link }">
        <span class="group-hover:text-primary relative m-2">{{ link.label }}</span>
      </template>
    </UVerticalNavigation>

    <UContainer class="flex flex-1 w-full min-w-0">
      <slot/>
    </UContainer>
  </div>
</template>

<style scoped>
.theme {
  position: absolute;
  right: 0;
  top: 0;
}


</style>