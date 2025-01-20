<script setup lang="ts">

const props = defineProps({
  orderDetails: {
    type: Array as PropType<OrderDetail[]>,
    required: true,
  },
})

const emit = defineEmits<{
  (event: 'remove-item', index: number): void
}>()

const totalPrice = computed(() => {
  return props.orderDetails.reduce((total, item) => total + item.price * (1 + item.tax / 100), 0)
})

function removeItem(index: number) {
  emit('remove-item', index)
}
</script>

<template>
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
              @click="removeItem(index)"
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
</template>
