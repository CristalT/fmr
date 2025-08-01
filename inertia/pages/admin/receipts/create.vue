<script setup lang="ts">
import { AdminLayout, CustomerSelect } from '~/components'
import { Card, Input, Button, Select, Icon } from '~/components/ui'

import { useForm } from '@inertiajs/vue3'
import { computed, ref, watchEffect } from 'vue'
import { sumBy } from 'lodash-es'
import { useToast } from '~/composables'

import CustomerOrders from '~/components/CustomerOrders.vue'

const { toast } = useToast()

const form = useForm({
  paymentDate: new Date().toISOString().split('T')[0], // Default to today's date
  customerId: '',
  amount: 0,
  description: '',
  paymentMethods: [{ method: 'cash', amount: 0, description: '' }],
  orderIds: [] as number[],
})

const handleSelectedOrder = (order: { id: number; date: string; amount: number }) => {
  const idx = selectedOrders.value.findIndex((o) => o.id === order.id)
  if (idx > -1) {
    selectedOrders.value.splice(idx, 1)
  } else {
    selectedOrders.value.push(order)
  }

  form.orderIds = selectedOrders.value.map((o) => o.id)
}

const selectedOrders = ref<{ id: number; date: string; amount: number }[]>([])

const debt = computed(() => {
  return sumBy(selectedOrders.value, 'amount')
})
const amount = computed(() => {
  return sumBy(form.paymentMethods, 'amount')
})

function addPaymentMethod() {
  form.paymentMethods.push({ method: 'cash', amount: 0, description: '' })
}

function removePaymentMethod(index: number) {
  form.paymentMethods.splice(index, 1)
}

function submit() {
  form.post('/admin/receipts', {
    onError: (errors) => {
      toast.error(`Error al crear el recibo. ${Object.values(errors).flat().join('. ')}`)
    },
  })
}

watchEffect(() => {
  form.amount = amount.value
})
</script>

<template>
  <form @submit.prevent="submit">
    <AdminLayout>
      <Card title="Crear Recibo">
        <div class="flex gap-4">
          <Input v-model="form.paymentDate" type="date" label="Fecha" required />
          <CustomerSelect v-model="form.customerId" label="Cliente" required class="grow" />
        </div>

        <Input v-model="form.description" type="text" label="Detalle" required class="mt-2" />

        <h4 class="my-4 pt-6 text-lg font-semibold">Pedidos Adeudados</h4>

        <CustomerOrders v-model="form.customerId" @selected="handleSelectedOrder" />
        <div class="my-4 flex items-center gap-4 pt-6">
          <h4 class="text-lg font-semibold">Pagos</h4>
          <Button type="button" @click="addPaymentMethod" variant="secondary" flat>
            <template #icon>
              <Icon name="add" />
            </template>
          </Button>
        </div>
        <div
          v-for="(payment, index) in form.paymentMethods"
          :key="index"
          class="mt-2 flex items-center gap-2">
          <Select
            v-model="payment.method"
            label="Método de Pago"
            :options="[
              { value: 'cash', label: 'Efectivo' },
              { value: 'credit_card', label: 'Tarjeta de Crédito' },
              { value: 'debit_card', label: 'Tarjeta de Débito' },
              { value: 'bank_transfer', label: 'Transferencia Bancaria' },
              { value: 'mercadopago', label: 'Mercado Pago' },
            ]"
            required
            class="w-52" />

          <Input
            v-model="payment.amount"
            type="number"
            label="Monto"
            required
            placeholder="Ingrese el monto del recibo" />

          <Input
            v-model="payment.description"
            type="text"
            label="Detalle"
            placeholder="Ingrese el detalle del pago"
            class="grow" />
          <Button
            type="button"
            @click="removePaymentMethod(index)"
            variant="danger"
            flat
            class="mt-7">
            <template #icon>
              <Icon name="delete" />
            </template>
          </Button>
        </div>
      </Card>

      <template #footer>
        <div class="flex items-center justify-end gap-6">
          <div>
            Total a cobrar:
            <span class="font-semibold">${{ debt }}</span>
          </div>
          <div>
            Total cobrado:
            <span class="font-semibold">${{ amount }}</span>
          </div>
          <Button type="submit" label="Aceptar" />
        </div>
      </template>
    </AdminLayout>
  </form>
</template>
