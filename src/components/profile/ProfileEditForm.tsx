import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthContext } from '@/context/AuthContext'
import { useProfile } from '@/hooks/useProfile'
import { profileSchema, type ProfileFormData } from '@/schemas/profileSchemas'

export function ProfileEditForm() {
    const { user } = useAuthContext()
    const { updateProfile, isLoading, error, success } = useProfile()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            username: user?.username ?? '',
            bio: '',
        },
        mode: 'onBlur',
    })

    const onSubmit = async (data: ProfileFormData) => {
        await updateProfile(data)
    }

    return (
        <div id="edit">
            {/* Section header */}
            <div className="border-l-[3px] border-gh-purple pl-4 mb-6">
                <div className="font-mono text-[11px] tracking-[3px] text-gh-purple mb-1">
                    // SETTINGS
                </div>
                <h2 className="font-bebas text-3xl tracking-widest text-gh-text">
                    EDIT PROFILE
                </h2>
            </div>

            <div className="bg-gh-card border border-gh-border p-6 sm:p-8 clip-lg">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

                    {/* Display name */}
                    <div className="flex flex-col gap-2">
                        <label className="font-mono text-[11px] tracking-[2px] uppercase text-gh-muted">
                            Display Name
                        </label>
                        <input
                            {...register('username')}
                            type="text"
                            placeholder="Enter display name"
                            className="w-full bg-gh-card2 border border-gh-border text-gh-text font-rajdhani text-base px-4 py-3 outline-none transition-colors duration-200 focus:border-gh-purple placeholder:text-gh-faint"
                        />
                        {errors.username && (
                            <span className="font-rajdhani text-xs text-gh-red mt-0.5">
                                {errors.username.message}
                            </span>
                        )}
                    </div>

                    {/* Bio */}
                    <div className="flex flex-col gap-2">
                        <label className="font-mono text-[11px] tracking-[2px] uppercase text-gh-muted">
                            Bio
                        </label>
                        <textarea
                            {...register('bio')}
                            placeholder="Tell the arena who you are..."
                            rows={4}
                            className="w-full bg-gh-card2 border border-gh-border text-gh-text font-rajdhani text-base px-4 py-3 outline-none transition-colors duration-200 focus:border-gh-purple placeholder:text-gh-faint resize-none"
                        />
                        {errors.bio && (
                            <span className="font-rajdhani text-xs text-gh-red mt-0.5">
                                {errors.bio.message}
                            </span>
                        )}
                        <span className="font-mono text-[10px] text-gh-faint text-right">
                            Max 160 characters
                        </span>
                    </div>

                    {/* API error */}
                    {error && (
                        <div className="bg-[rgba(255,34,0,0.08)] border border-gh-red px-4 py-3">
                            <p className="font-rajdhani text-sm text-gh-red">{error}</p>
                        </div>
                    )}

                    {/* Success message */}
                    {success && (
                        <div className="bg-[rgba(34,197,94,0.08)] border border-green-500 px-4 py-3">
                            <p className="font-rajdhani text-sm text-green-500">
                                Profile updated successfully!
                            </p>
                        </div>
                    )}

                    {/* Submit */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary font-bebas tracking-widest text-base px-8 py-2.5"
                        >
                            {isLoading ? 'SAVING...' : 'SAVE CHANGES'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}