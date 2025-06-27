import http from "~/shared/http"
import { useQuery } from "@tanstack/vue-query"
import type Product from "#models/product"
import type { Meta } from "~/types/metadata"
import { Ref } from "vue"

type Params = {
  terms: string,
  page: number,
  filter: Record<string, any>
}

const queryFn = (params: Params) => http('admin/products')
  .cancellable('fetch_products_list')
  .query({ ...params })
  .get<{ data: Product[], meta: Meta }>('data')

export default function useProduct() {
  const fetchAll = (params: Ref<Params>) => useQuery({
    queryKey: ['products', params],
    queryFn: () => queryFn(params.value),
  })
  return { fetchAll }
}
