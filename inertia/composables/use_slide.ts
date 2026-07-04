import http from '~/shared/http'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type Slide from '#models/slide'

export default function useSlide() {
  const queryClient = useQueryClient()

  const fetchAll = (options: { enabled: boolean } = { enabled: true }) =>
    useQuery({
      queryKey: ['slides'],
      queryFn: () => http('admin/slides').cancellable('fetch_slides').get<Slide[]>('data'),
      enabled: options.enabled,
    })

  const updateOrder = useMutation({
    mutationFn: (slidesOrder: { id: number; order: number }[]) => {
      const key = `update_slides_order`
      return http(`admin/slides-order`)
        .cancellable(key)
        .post<{ data: { id: number; order: number }[] }>({ slidesOrder })
    },
    onMutate: async (newOrder) => {
      await queryClient.cancelQueries({ queryKey: ['slides'] })
      const previousOrder = queryClient.getQueryData(['slides'])

      queryClient.setQueryData(['slides'], (oldData: any) => {
        return oldData
          .map((item: any) => {
            const element = newOrder.find((s) => s.id === item.id)
            if (!element) throw new Error('Element not found in the new order list')
            item.order = element.order
            return item
          })
          .sort((a: any, b: any) => a.order - b.order)
      })
      return { previousOrder }
    },
    onError: (err, _, context) => {
      console.error(err)
      queryClient.setQueryData(['slides'], context?.previousOrder)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['slides'] }),
  })

  return { fetchAll, updateOrder }
}
