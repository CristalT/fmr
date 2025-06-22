<script setup lang="ts">
import MainLayout from '~/components/MainLayout.vue'
import MainHeader from '~/components/MainHeader.vue'
import Recaptcha from '~/components/Recaptcha.vue'
import { onMounted, reactive, ref } from 'vue'
import { z } from '~/shared/es_zod'
import useValidation from '~/composables/use_validation'
import http from '~/shared/http'
import { useToast } from '~/composables'
import { Card, Input, Button } from '~/components/ui'
import { usePage } from '@inertiajs/vue3'
const { toast } = useToast()

const page = usePage()

const props = defineProps<{
  product: any
}>()

const recaptcha = ref()

const FormSchema = z.object({
  name: z.string().max(50).min(4).nonempty(),
  email: z.string().email(),
  phone: z.string().max(20),
  subject: z.string().max(50),
  message: z.string().max(180),
  recaptchaToken: z.string(),
})

const form = reactive<z.infer<typeof FormSchema>>({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  recaptchaToken: '',
})

const { validate, isValid, getError } = useValidation(FormSchema, form)

function clearForm() {
  Object.keys(form).forEach((key) => {
    if (key in form) {
      ;(form as any)[key] = ''
    }
  })
}

function setToken(token: string) {
  form.recaptchaToken = token
}

async function onSubmit() {
  await validate()

  if (isValid.value) {
    http
      .post('contact', form)
      .then(() => {
        clearForm()
        toast.success('Formulario enviado con exito.')
      })
      .catch((error) => {
        console.error(error)
        toast.error('Error al enviar el formulario.')
      })
  } else {
    toast.error('Revise los campos del formulario.')
  }

  recaptcha.value?.resetRecaptcha()
}

onMounted(() => {
  const subject = page.url.split('subject=')[1] || ''
  if (subject) {
    form.subject = decodeURIComponent(subject)
  }
  if (props.product) {
    form.subject = `${props.product.name}`
  }
})
</script>
<template>
  <MainLayout>
    <template #header>
      <MainHeader />
    </template>
    <Card class="bg-white p-4 rounded-md shadow-lg">
      <template #header>
        <h1 class="text-xl font-bold text-gray-700">Contacto</h1>
      </template>
      <form @submit.prevent="onSubmit" class="flex flex-col gap-2 ">

      <div>
        <Input autofocus label="Nombre" v-model="form.name" :error="getError('name')" />
      </div>
      <div>
        <Input label="Email" v-model="form.email" :error="getError('email')" />
      </div>
      <div>
        <Input label="Teléfono" type="phone" v-model="form.phone" :error="getError('phone')" />
      </div>
      <div>
        <Input label="Asunto" v-model="form.subject" :error="getError('subject')" />
      </div>
      <div>
        <Input
          label="Mensaje"
          type="textarea"
          v-model="form.message"
          placeholder="Escriba su mensaje aquí ..."
          :error="getError('message')"
        />
      </div>
      <div>
        <Recaptcha ref="recaptcha" @verify="setToken" />
      </div>
      <Button type="submit" label="Enviar" />
    </form>
  </Card>

  </MainLayout>
</template>
