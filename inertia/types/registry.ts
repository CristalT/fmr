import { z } from '~/shared/es_zod'

export const RegistrySchema = z.object({
  id: z.number().optional(),
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  dni: z.string().min(8),
  email: z.string().email(),
  phone: z.string().min(6),
  address: z.string().min(3),
  postalCode: z.string().min(4),
  city: z.string().min(3),
  province: z.string().min(3),
  captchaToken: z.string().min(3).optional(),
})

export type Registry = z.infer<typeof RegistrySchema>
