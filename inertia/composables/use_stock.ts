import http from "~/shared/http"
import { useMutation, useQuery } from "@tanstack/vue-query"
import type Product from "#models/product"
import type { Meta } from "~/types/metadata"
import { Ref } from "vue"

type Params = {
  terms?: string,
  page?: number,
  filter?: Record<string, any>
  onlyPublic?: boolean
}

export default function useProduct() {
  const fetchAll = (params: Ref<Params>) => useQuery({
    queryKey: ['products', params],
    queryFn: () => http('admin/stock')
      .cancellable('fetch_products_list')
      .query({ ...params.value })
      .get<{ data: Product[], meta: Meta }>('data'),
  })

  const update = (id: string, payload: Partial<Product>) => useMutation({
    mutationKey: ['update_product', id],
    mutationFn: () => http(`admin/stock/${id}`)
      .cancellable('update_product')
      .put(payload)
  })
  return { fetchAll, update }
}
