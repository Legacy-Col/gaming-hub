import { z } from "zod";


export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email address'),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters long')
})

// REPLACE the current registerSchema with this
export const registerSchema = z.object({
    name: z
        .string()
        .min(3, 'Name must be at least 3 characters long')
        .max(20, 'Name must be at most 20 characters long'),
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email address'),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z
        .string()
        .min(6, 'Confirm password must be at least 6 characters long'),
}).superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Passwords do not match',
            path: ['confirmPassword'],
        })
    }
})

export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email address'),
})

export type LoginData = z.infer<typeof loginSchema>;    
export type RegisterData = z.infer<typeof registerSchema>;
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;