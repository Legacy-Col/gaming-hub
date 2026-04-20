import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { forgotPasswordSchema, type ForgotPasswordData } from '@/schemas/authSchemas'
import { useAuth } from '@/hooks/useAuth'
import logoImg from '@/assets/hub.jpeg'

export function ForgotPasswordPage() {
    const { handleForgotPassword, isLoading, error } = useAuth()
    const [submitted, setSubmitted] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordData>({
        resolver: zodResolver(forgotPasswordSchema),
        mode: 'onBlur',
    })

    const onSubmit = async (data: ForgotPasswordData) => {
        await handleForgotPassword(data)
        setSubmitted(true)
    }

    return (
        <div className="min-h-screen bg-gh-bg flex items-center justify-center px-4">

            {/* Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <svg className="absolute inset-0 w-full h-full opacity-[0.04]">
                    <defs>
                        <pattern id="fp-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#7B2FBE" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#fp-grid)" />
                </svg>
                <div className="absolute inset-0"
                    style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(123,47,190,0.08) 0%, transparent 70%)' }} />
            </div>

            {/* Card */}
            <div className="relative z-10 w-full max-w-md">

                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <img
                        src={logoImg}
                        alt="Gaming Hub Africa"
                        className="h-16 w-auto object-contain"
                        style={{ mixBlendMode: 'screen' }}
                    />
                </div>

                <div className="bg-gh-card border border-gh-border p-8 clip-lg">

                    {submitted ? (
                        /* ── Success state ── */
                        <div className="text-center py-4 flex flex-col items-center gap-4">
                            <div className="text-5xl">✉</div>
                            <h2 className="font-bebas text-3xl tracking-widest text-gh-text">
                                CHECK YOUR EMAIL
                            </h2>
                            <p className="font-rajdhani text-gh-muted text-sm text-center leading-relaxed">
                                We've sent a password reset link to your email inbox. Follow the instructions to reset your password.
                            </p>
                            <Link
                                to="/login"
                                className="font-rajdhani text-sm text-gh-muted hover:text-gh-purple transition-colors mt-2">
                                Back to <span className="text-gh-purple font-semibold">Login</span>
                            </Link>
                        </div>

                    ) : (
                        /* ── Form state ── */
                        <>
                            <h1 className="font-bebas text-4xl tracking-widest text-gh-text text-center mb-1">
                                FORGOT PASSWORD
                            </h1>
                            <p className="font-rajdhani text-gh-muted text-center text-sm tracking-wider mb-8">
                                Enter your email and we'll send you a reset link
                            </p>

                            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

                                {/* Email field */}
                                <div className="flex flex-col gap-2">
                                    <label className="font-mono text-[11px] tracking-[2px] uppercase text-gh-muted">
                                        Email
                                    </label>
                                    <input
                                        {...register('email')}
                                        type="email"
                                        placeholder="Enter your email"
                                        className="w-full bg-gh-card2 border border-gh-border text-gh-text font-rajdhani text-base px-4 py-4 outline-none transition-colors duration-200 focus:border-gh-purple placeholder:text-gh-faint"
                                    />
                                    {errors.email && (
                                        <span className="text-xs font-rajdhani text-gh-red mt-0.5">
                                            {errors.email.message}
                                        </span>
                                    )}
                                </div>

                                {/* API error */}
                                {error && (
                                    <div className="bg-[rgba(255,34,0,0.08)] border border-gh-red px-4 py-3">
                                        <p className="font-rajdhani text-sm text-gh-red">{error}</p>
                                    </div>
                                )}

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="btn-primary w-full text-lg py-3 mt-2"
                                >
                                    {isLoading ? 'SENDING...' : 'SEND RESET LINK'}
                                </button>

                            </form>

                            {/* Link */}
                            <div className="mt-6 flex justify-center">
                                <Link
                                    to="/login"
                                    className="font-rajdhani text-sm text-gh-muted hover:text-gh-purple transition-colors">
                                    Remember your password?{' '}
                                    <span className="text-gh-purple font-semibold">Log In</span>
                                </Link>
                            </div>
                        </>
                    )}

                </div>
            </div>
        </div>
    )
}