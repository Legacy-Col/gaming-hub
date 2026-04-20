import { z } from 'zod'

export const createTeamSchema = z.object({
    name: z
        .string()
        .min(3, 'Team name must be at least 3 characters')
        .max(30, 'Team name must be at most 30 characters'),
    tag: z
        .string()
        .min(2, 'Tag must be at least 2 characters')
        .max(5, 'Tag must be at most 5 characters')
        .toUpperCase(),
    game: z
        .string()
        .min(1, 'Please select a game'),
    description: z
        .string()
        .min(10, 'Description must be at least 10 characters')
        .max(200, 'Description must be at most 200 characters'),
})

export const joinTeamSchema = z.object({
    teamId: z
        .string()
        .min(1, 'Team ID is required'),
})

export type CreateTeamData = z.infer<typeof createTeamSchema>
export type JoinTeamData   = z.infer<typeof joinTeamSchema>