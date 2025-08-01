<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { loadScript, unloadScript } from '~/shared/load_scripts'

const mercadoPagoScript = 'https://sdk.mercadopago.com/js/v2'

const { preference, mpPublicKey } = defineProps<{
  preference: Record<string, any>
  mpPublicKey: string
}>()

async function renderWalletBrick() {
  const mp = new (window as any).MercadoPago(mpPublicKey, {
    locale: 'es-AR',
  })

  await mp.bricks().create('wallet', 'walletBrick_container', {
    initialization: {
      preferenceId: preference.id,
    },
    customization: {
      theme: 'dark',
      valueProp: 'practicality',
      customStyle: {
        valuePropColor: 'black',
        buttonHeight: '48px',
        borderRadius: '4px',
        verticalPadding: '10px',
        horizontalPadding: '10px',
      },
    },
  })
}

onMounted(() => {
  loadScript(mercadoPagoScript)
    .then(() => {
      renderWalletBrick()
    })
    .catch((error) => {
      console.error('Error loading Mercado Pago SDK:', error)
    })
})

onUnmounted(() => {
  unloadScript(mercadoPagoScript)
})
</script>

<template>
  <div id="walletBrick_container" class="w-full"></div>
</template>
