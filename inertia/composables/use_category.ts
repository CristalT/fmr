import { useMutation, useQuery } from '@tanstack/vue-query'
import type Category from '#models/category'
import http from '~/shared/http'

export type CreateCategory = {
  name: string
  slug: string
  description?: string
  parentId: number | null
  productIds?: string[]
}

export default function useCategory(parentId: number | null = null) {
  function fetch() {
    return useQuery({
      queryKey: ['categories', parentId],
      queryFn: () => {
        const request = http('/admin/categories')
        if (parentId) {
          request.query({ parentId })
        }

        return request.get<Category[]>('data')
      },
    })
  }

  function fetchOne(categoryId: number) {
    return http(`/admin/categories/${categoryId}`).get<Category>('data')
  }

  function create() {
    return useMutation({
      mutationFn: (body: CreateCategory) => {
        return http('/admin/categories').post<Category>(body, 'data')
      },
    })
  }

  function remove(categoryId: number) {
    return http(`/admin/categories/${categoryId}`).delete()
  }

  function update(categoryId: number, category: Partial<CreateCategory>) {
    return http(`/admin/categories/${categoryId}`).put<Category>(category)
  }

  return {
    fetch,
    fetchOne,
    create,
    remove,
    update,
  }
}
