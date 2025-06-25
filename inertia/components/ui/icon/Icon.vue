<script setup lang="ts">
import { computed } from 'vue';
import EditIcon from '~/components/icons/EditIcon.vue'
import DeleteIcon from '~/components/icons/DeleteIcon.vue'
import CartIcon from '~/components/icons/CartIcon.vue'
import PrintIcon from '~/components/icons/PrinterIcon.vue'
import SendIcon from '~/components/icons/SendIcon.vue'
import AddIcon from '~/components/icons/AddIcon.vue'
import OrdersIcon from '~/components/icons/OrdersIcon.vue'
import CheckIcon from '~/components/icons/CheckIcon.vue';

const icons = {
  edit: EditIcon,
  delete: DeleteIcon,
  cart: CartIcon,
  print: PrintIcon,
  send: SendIcon,
  add: AddIcon,
  orders: OrdersIcon,
  check: CheckIcon
}

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const { size = 'md', name } = defineProps<{ size?: Size, name: keyof typeof icons }>()

const sizeMap: Record<Size, string> = {
  xs: '12',
  sm: '16',
  md: '24',
  lg: '32',
  xl: '48',
}

const computedSize = computed(() => sizeMap[size])


</script>
<template>
  <component :is="icons[name]" :size="computedSize" />
</template>
