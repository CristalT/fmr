import http from '~/shared/http'
import { useMutation, useQuery } from '@tanstack/vue-query'
import type Provider from '#models/provider'
import { Ref } from 'vue'
import { Meta } from '~/types/metadata'

type Params = {
  terms?: string
  page?: number
}

export default function useProduct() {
  const fetchOptions = () => {
    return useQuery({
      queryKey: ['provider_options'],
      queryFn: () => {
        return http('admin/providers').cancellable('fetch_providers_list').get<Provider[]>('data')
      },
      select: (data) => data.map((provider) => ({ label: provider.alias, value: provider.alias })),
    })
  }

  const fetchAll = (params: Ref<Params>) => {
    type ProviderRow = Provider & {
      productCounts: { published: number; unpublished: number }
    }

    return useQuery({
      queryKey: ['providers', params],
      queryFn: () => {
        return http('admin/providers')
          .cancellable('fetch_providers_list')
          .query({ ...params.value })
          .get<{ data: ProviderRow[]; meta: Meta }>('data')
      },
    })
  }
  const updateProductsPublication = (alias: string) =>
    useMutation({
      mutationKey: ['update_products_publication', alias],
      mutationFn: (isPublic: boolean) =>
        http(`admin/providers/${alias}/products-publication`)
          .cancellable('update_products_publication')
          .patch<{ data: { total: number; published: number; unpublished: number } }>({
            public: isPublic,
          })
          .then((res) => res.data),
    })

  return { fetchOptions, fetchAll, updateProductsPublication }
}
