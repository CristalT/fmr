import { createApp, h } from 'vue'

import { ConfirmDialog } from '~/components/ui'

export default function useConfirm() {
  const createConfirmDialogApp = (
    options: {
      title?: string
      message?: string
      confirm?: string
      cancel?: string
    },
    resolve: (value: boolean) => void
  ) => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const removeDialog = (state: boolean) => {
      if (!state) {
        resolve(false)
        app.unmount()
        document.body.removeChild(container)
      }
    }

    const handleConfirm = () => {
      resolve(true)
      app.unmount()
      document.body.removeChild(container)
    }

    const handleCancel = () => {
      resolve(false)
      app.unmount()
      document.body.removeChild(container)
    }

    const app = createApp({
      setup() {
        return () =>
          h(ConfirmDialog, {
            ...options,
            'onConfirm': handleConfirm,
            'onCancel': handleCancel,
            'onUpdate:open': removeDialog,
          })
      },
    })

    app.mount(container)
    return app
  }

  const confirmation = (
    options: {
      title?: string
      message?: string
      confirm?: string
      cancel?: string
    } = {}
  ) => {
    return new Promise<boolean>((resolve) => {
      createConfirmDialogApp(options, resolve)
    })
  }

  return { confirmation }
}
