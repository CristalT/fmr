<script setup lang="ts">
import MainLayout from '~/components/MainLayout.vue'
import MainHeader from '~/components/MainHeader.vue'

import { Button, Input, Card } from '~/components/ui'
import useValidation from '~/composables/use_validation'
import http from '~/shared/http'
import Recaptcha from '~/components/Recaptcha.vue'

import { reactive, ref } from 'vue'
import { useToast } from '~/composables'
import { type Registry, RegistrySchema } from '~/types/registry'

const { toast } = useToast()

const recaptcha = ref()

const registry = reactive<Registry>({
  firstName: '',
  lastName: '',
  dni: '',
  email: '',
  phone: '',
  address: '',
  postalCode: '',
  city: '',
  province: '',
  captchaToken: '',
})

const { validate, isValid, getError } = useValidation(RegistrySchema, registry)

const setCaptchaToken = (token: string) => {
  registry.captchaToken = token
}

const cleanForm = () => {
  Object.keys(registry).forEach((key) => {
    ;(registry as any)[key] = ''
  })
}

const onSubmit = async () => {
  await validate()

  if (!isValid.value) return toast.error('Revise los campos del formulario.')

  http('registries')
    .post(registry)
    .then(() => {
      toast.success('Formulario enviado con exito.')
      cleanForm()
      recaptcha.value?.resetRecaptcha()
    })
    .catch((error) => {
      console.error(error)
      toast.error('Error al enviar el formulario.')
    })

}
</script>
<template>
  <MainLayout>
    <template #header>
      <MainHeader />
    </template>

    <div class="flex items-center justify-center max-w-[800px] m-auto h-full">
      <Card class="w-full">
        <template #header>
          <h1 class="text-2xl font-bold">Registro de usuario</h1>
        </template>
        <form @submit.prevent="onSubmit">
          <div class="flex flex-col gap-2">
            <Input label="Nombre" v-model="registry.firstName" :error="getError('firstName')" />
            <Input label="Apellido" v-model="registry.lastName" :error="getError('lastName')" />
            <Input label="DNI / CUIL / CUIT" v-model="registry.dni" :error="getError('dni')" />
            <Input label="Email" v-model="registry.email" :error="getError('email')" />
            <Input label="Teléfono" v-model="registry.phone" :error="getError('phone')" />
            <Input label="Dirección" v-model="registry.address" :error="getError('address')" />
            <Input label="Código Postal" v-model="registry.postalCode" :error="getError('postalCode')" />
            <Input label="Localidad" v-model="registry.city" :error="getError('city')" />
            <Input label="Provincia" v-model="registry.province" :error="getError('province')" />

            <Recaptcha ref="recaptcha" @verify="setCaptchaToken" />

            <Button type="submit" label="Enviar" class="mt-4" />
          </div>
        </form>
      </Card>
    </div>
  </MainLayout>
</template>
