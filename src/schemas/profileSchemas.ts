import { z } from 'zod'

export const profileSchema = z.object({
    username: z
        .string()
        .min(3, 'Name must be at least 3 characters')
        .max(20, 'Name must be at most 20 characters'),
    bio: z
        .string()
        .max(160, 'Bio must be at most 160 characters')
        .optional(),
})

export type ProfileFormData = z.infer<typeof profileSchema>