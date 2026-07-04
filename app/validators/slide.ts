import vine from '@vinejs/vine'

export const createSlideValidator = vine.compile(
  vine.object({
    title: vine.string().maxLength(160),
    tagline: vine.string().maxLength(255),
    ctaText: vine.string().maxLength(100),
    ctaHref: vine.string().maxLength(255),
    badge: vine.string().maxLength(100).nullable().optional(),
    theme: vine.enum(['primary', 'secondary']).optional(),
    public: vine.boolean().optional(),
  })
)

export const updateSlideValidator = vine.compile(
  vine.object({
    title: vine.string().maxLength(160),
    tagline: vine.string().maxLength(255),
    ctaText: vine.string().maxLength(100),
    ctaHref: vine.string().maxLength(255),
    badge: vine.string().maxLength(100).nullable().optional(),
    theme: vine.enum(['primary', 'secondary']).optional(),
    public: vine.boolean().optional(),
    order: vine.number().min(0).optional(),
  })
)
