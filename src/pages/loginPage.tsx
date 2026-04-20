import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { loginSchema, type LoginData } from "@/schemas/authSchemas";
import { useAuth } from "@/hooks/useAuth";
import logoImg from "@/assets/hub.jpeg";


export function LoginPage() {
    const { handleLogin, isLoading, error } = useAuth()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginData>({
        resolver: zodResolver(loginSchema)
    })

    const onSubmit = async (data: LoginData) => {
        console.log('Form submitted with:', data)  // ← add this
        await handleLogin(data)
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
                        className="h-16 w-auto object-contain"
                        style={{ mixBlendMode: 'screen' }}
                    />
                </div>

                {/* Form card */}
                <div className="bg-gh-card border border-gh-border p-8 clip-lg">
                    {/* Heading */}
                    <h1 className="font-bebas text-4xl tracking-widest text-gh-text text-center mb-1">
                        WELCOME BACK
                    </h1>
                    <p className="font-rajdhani text-gh-muted text-center text-sm tracking-wider mb-8">
                        Log in to your account
                    </p>

                    {/* Form coming soon */}
                    <form
                        onSubmit={handleSubmit(onSubmit, (errors) => {
                            console.log('Validation errors:', errors)  // ← add this
                        })}
                        className="flex flex-col gap-4"
                    >
                        {/* Username Field*/}
                        <div className="flex flex-col gap-2">
                            <label className="font-mono text-[11px] tracking-[2px] uppercase text-gh-muted">
                                Email
                            </label>
                            <input
                                {...register("email")}
                                type="text"
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
                            {isLoading ? 'Logging in...' : 'Log In'}
                        </button>
                    </form>
                    {/* Links */}
                    <div className="mt-6 flex flex-col items-center gap-3">
                        <Link to="/forgot-password"
                            className="font-rajdhani text-sm text-gh-muted hover:text-gh-purple transition-colors">
                            Forgot your password?
                        </Link>
                        <Link to="/register"
                            className="font-rajdhani text-sm text-gh-muted hover:text-gh-purple transition-colors">
                            Don't have an account? <span className="text-gh-purple font-semibold">Register</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
