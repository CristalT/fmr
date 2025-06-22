import { ref } from 'vue'

interface Toast {
  id: number
  message: string
  type: 'info' | 'success' | 'warn' | 'error'
}

const toasts = ref<Toast[]>([])
let id = 0

export default function useToast() {
  const addToast = (message: string, type: Toast['type']) => {
    const toast: Toast = {
      id: id++,
      message,
      type,
    }
    toasts.value.push(toast)
    setTimeout(() => {
      removeToast(toast.id)
    }, 3000)
  }

  const removeToast = (toastId: number) => {
    const index = toasts.value.findIndex((t) => t.id === toastId)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  return {
    toasts,
    toast: {
      info: (message: string) => addToast(message, 'info'),
      success: (message: string) => addToast(message, 'success'),
      warn: (message: string) => addToast(message, 'warn'),
      error: (message: string) => addToast(message, 'error'),
    },
  }
}
