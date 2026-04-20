import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "react-router-dom"
import { registerSchema, type RegisterData } from "@/schemas/authSchemas"
import { useAuth } from "@/hooks/useAuth"
import logoImg from "@/assets/hub.jpeg"


export function RegisterPage() {
    const { handleRegister, isLoading, error } = useAuth()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterData>({
        resolver: zodResolver(registerSchema),
        mode: 'onBlur',  // ← add this line
    })

    const onSubmit = async (data: RegisterData) => {
        await handleRegister(data)
    }

    return (
        <div className="min-h-screen bg-gh-bg flex items-center justify-center px-4">
            {/* Background grid */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <svg className="absolute inset-0 w-full h-full opacity-[0.04]">
                    <defs>
                        <pattern id="login-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#7B2FBE" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#login-grid)" />
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
                        className="h-24 w-auto object-contain "
                        style={{ mixBlendMode: 'screen' }}
                    />
                </div>
                {/* Form card */}
                <div className="bg-gh-card border border-gh-border p-8 clip-lg">

                    {/* Heading */}
                    <h1 className="font-bebas text-4xl tracking-widest text-gh-text text-center mb-1">
                        CREATE ACCOUNT
                    </h1>
                    <p className="font-rajdhani text-gh-muted text-center text-sm tracking-wider mb-8">
                        Join our community today
                    </p>
                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

                        {/* Username Field*/}
                        <div className="flex flex-col gap-2">
                            <label className="font-mono text-[11px] tracking-[2px] uppercase text-gh-muted">
                                Username
                            </label>
                            <input
                                {...register("name")}
                                type="text"
                                placeholder="Enter your username"
                                className="w-full bg-gh-card2 border border-gh-border text-gh-text font-rajdhani text-base px-4 py-4 outline-none transition-colors duration-200 focus:border-gh-purple placeholder:text-gh-faint"
                            />
                            {errors.name && <span className="text-xs font-rajdhani text-gh-red mt-0.5">
                                {errors.name.message}
                            </span>}
                        </div>

                        {/*Email field*/}
                        <div className="flex flex-col gap-2">
                            <label className="font-mono text-[11px] tracking-[2px] uppercase text-gh-muted">
                                Email
                            </label>
                            <input
                                {...register("email")}
                                type="email"
                                placeholder="Enter your email"
                                className="w-full bg-gh-card2 border border-gh-border text-gh-text font-rajdhani text-base px-4 py-4 outline-none transition-colors duration-200 focus:border-gh-purple placeholder:text-gh-faint"
                            />
                            {errors.email && <span className="text-xs font-rajdhani text-gh-red mt-0.5">
                                {errors.email.message}
                            </span>}
                        </div>

                        {/* Password Field */}
                        <div className="flex flex-col gap-2">
                            <label className="font-mono text-[11px] tracking-[2px] uppercase text-gh-muted">
                                Password
                            </label>
                            <input
                                {...register("password")}
                                type="password"
                                placeholder="Enter your password"
                                className="w-full bg-gh-card2 border border-gh-border text-gh-text font-rajdhani text-base px-4 py-4 outline-none transition-colors duration-200 focus:border-gh-purple placeholder:text-gh-faint"
                            />
                            {errors.password && <span className="text-xs font-rajdhani text-gh-red mt-0.5">
                                {errors.password.message}
                            </span>}
                        </div>

                        {/*Confirm Password*/}
                        <div className="flex flex-col gap-2">
                            <label className="font-mono text-[11px] tracking-[2px] uppercase text-gh-muted">
                                Confirm Password
                            </label>
                            <input
                                {...register("confirmPassword")}
                                type="password"
                                placeholder="Please Confirm Password"
                                className="w-full bg-gh-card2 border border-gh-border text-gh-text font-rajdhani text-base px-4 py-4 outline-none transition-colors duration-200 focus:border-gh-purple placeholder:text-gh-faint"
                            />
                            {errors.confirmPassword && <span className="text-xs font-rajdhani text-gh-red mt-0.5">
                                {errors.confirmPassword.message}
                            </span>}
                        </div>

                        {/*Api error messages */}
                        {error &&
                            <div className=" bg-[rgba(255,34,0,0.08)] border border-gh-red px-4 py-3">
                                <p className="font-rajdhani text-sm text-gh-red-dim">
                                    {error}
                                </p>
                            </div>
                        }

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full text-lg py-3 mt-2"
                        >
                            {isLoading ? 'CREATING ACCOUNT' : 'Create ACCOUNT'}
                        </button>
                    </form>
                    {/* Links */}
                    <div className="mt-6 flex flex-col items-center gap-3">
                        <Link to="/login"
                            className="font-rajdhani text-sm text-gh-muted hover:text-gh-purple transition-colors">
                            Already have an account ? <span className="text-gh-purple font-semibold">Login</span>
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    )

}
