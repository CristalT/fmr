import http from '~/shared/http'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type Showcase from '#models/showcase'

export default function useShowcase() {
  const queryClient = useQueryClient()

  const fetchAll = (options: { enabled: boolean } = { enabled: true }) =>
    useQuery({
      queryKey: ['showcases'],
      queryFn: () => http('showcases').cancellable('fetch_showcase').get<Showcase[]>('data'),
      enabled: options.enabled,
    })

  const create = useMutation({
    mutationFn: (payload: Showcase) =>
      http(`admin/showcases`).cancellable('create_showcase').post(payload),
  })

  const updateOrder = useMutation({
    mutationFn: (showcasesOrder: { id: number; order: number }[]) => {
      const key = `update_showcases_order`
      return http(`admin/showcases-order`)
        .cancellable(key)
        .post<{ data: { id: number; order: number }[] }>({ showcasesOrder })
    },
    onMutate: async (newOrder) => {
      await queryClient.cancelQueries({ queryKey: ['showcases'] })
      const previousOrder = queryClient.getQueryData(['showcases'])

      queryClient.setQueryData(['showcases'], (oldData: any) => {
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
      queryClient.setQueryData(['showcases'], context?.previousOrder)
    },
    // Always refetch after error or success:
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['showcases'] }),
  })
  return { fetchAll, create, updateOrder }
}
