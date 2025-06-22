<script setup lang="ts">
import { useForm } from '@inertiajs/vue3'
import { Button } from '~/components/ui'
import Input from '~/components/ui/input/Input.vue'

defineProps(['errors'])

const form = useForm({
  email: '',
  password: '',
})
</script>

<template>
  <form
    @submit.prevent="form.post('/auth/login')"
    class="h-screen w-screen flex items-center justify-center bg-gray-100"
  >
    <div class="w-[400px] flex flex-col gap-4 shadow-md p-4 rounded-md bg-white">
      <div class="uppercase text-center font-semibold p-4">login</div>
      <div>
        <Input
          type="email"
          placeholder="Email"
          v-model="form.email"
          :error="form.errors.email"
          autofocus
        />
      </div>
      <div>
        <Input
          type="password"
          placeholder="Password"
          v-model="form.password"
          :error="form.errors.password"
        />
      </div>
      <div class="flex justify-center">
        <Button label="Ingresar" type="submit" :disabled="form.processing" />
      </div>
    </div>
  </form>
</template>
