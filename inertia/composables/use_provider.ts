import http from '~/shared/http'
import { useQuery } from '@tanstack/vue-query'
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
    return useQuery({
      queryKey: ['providers', params],
      queryFn: () => {
        return http('admin/providers')
          .cancellable('fetch_providers_list')
          .query({ ...params.value })
          .get<{ data: Provider[]; meta: Meta }>('data')
      },
    })
  }
  return { fetchOptions, fetchAll }
}
