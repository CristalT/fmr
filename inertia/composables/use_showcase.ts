import http from "~/shared/http"
import { useMutation, useQuery } from "@tanstack/vue-query"
import type Showcase from "#models/showcase"

export default function useShowcase() {
  const fetchAll = useQuery({
    queryKey: ['showcases'],
    queryFn: () => http('showcases')
      .cancellable('fetch_showcase')
      .get<Showcase[]>('data'),
  })

  const create = useMutation({
    mutationFn: (payload: Showcase) => http(`admin/showcases`)
      .cancellable('create_showcase')
      .post(payload)
  })
  return { fetchAll, create }
}
