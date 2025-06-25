<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { loadScript, unloadScript } from '~/shared/load_scripts'
import http from '~/shared/http'

const recaptchaScript =
  'https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit'
const emit = defineEmits({ verify: String })

const siteKey = ref()

function verify(token: string) {
  emit('verify', token)
}

function resetRecaptcha() {
  (window as any).grecaptcha.reset()
}

defineExpose({
  resetRecaptcha,
})

watch(siteKey, (newKey) => {
  if (newKey) {
    loadScript(recaptchaScript).then(() => {
      window.onloadCallback = () => {
        window.grecaptcha.render('recaptcha', {
          hl: 'es',
          sitekey: newKey,
          callback: verify,
          'expired-callback': resetRecaptcha,
        })
      }
    })
  }
})

onMounted(async () => {
  try {
    const { key } = await http('/captcha').get<{ data: { key: string } }>().then((res) => res.data)
    siteKey.value = key
  } catch (err) {
    console.error('Error getting the captcha key', err)
  }
})

onBeforeUnmount(async () => {
  await unloadScript(recaptchaScript)
  delete (window as any).onloadCallback
})
</script>

<template>
  <div v-if="siteKey" id="recaptcha" class="flex justify-center" :data-sitekey="siteKey" />
</template>
