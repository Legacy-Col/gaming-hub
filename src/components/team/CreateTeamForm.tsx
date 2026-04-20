import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTeam } from '@/hooks/useTeam'
import { createTeamSchema, type CreateTeamData } from '@/schemas/TeamSchemas'

const GAMES = [
    'Valorant', 'FIFA 25', 'Call of Duty: MW3',
    'eFootball', 'Mortal Kombat 1', 'Street Fighter 6',
]

export function CreateTeamForm() {
    const { createTeam, isLoading, error, success } = useTeam()
    const logoInputRef = useRef<HTMLInputElement>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateTeamData>({
        resolver: zodResolver(createTeamSchema),
        mode: 'onBlur',
    })

    const onSubmit = async (data: CreateTeamData) => {
        await createTeam({
            name: data.name,
            tag: data.tag,
            game: data.game,
            description: data.description,
        })
    }

    return (
        <div>
            {/* Section header */}
            <div className="border-l-[3px] border-gh-purple pl-4 mb-6">
                <div className="font-mono text-[11px] tracking-[3px] text-gh-purple mb-1">
                    // CREATE
                </div>
                <h2 className="font-bebas text-3xl tracking-widest text-gh-text">
                    CREATE A TEAM
                </h2>
            </div>

            <div className="bg-gh-card border border-gh-border p-6 sm:p-8 clip-lg">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

                    {/* Team name + Tag row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Team name */}
                        <div className="sm:col-span-2 flex flex-col gap-2">
                            <label className="font-mono text-[11px] tracking-[2px] uppercase text-gh-muted">
                                Team Name
                            </label>
                            <input
                                {...register('name')}
                                placeholder="e.g. Lagos Lions"
                                className="w-full bg-gh-card2 border border-gh-border text-gh-text font-rajdhani text-base px-4 py-3 outline-none transition-colors focus:border-gh-purple placeholder:text-gh-faint"
                            />
                            {errors.name && (
                                <span className="font-rajdhani text-xs text-gh-red">
                                    {errors.name.message}
                                </span>
                            )}
                        </div>

                        {/* Tag */}
                        <div className="flex flex-col gap-2">
                            <label className="font-mono text-[11px] tracking-[2px] uppercase text-gh-muted">
                                Tag (max 5)
                            </label>
                            <input
                                {...register('tag')}
                                placeholder="e.g. LGL"
                                maxLength={5}
                                className="w-full bg-gh-card2 border border-gh-border text-gh-text font-rajdhani text-base px-4 py-3 outline-none transition-colors focus:border-gh-purple placeholder:text-gh-faint uppercase"
                            />
                            {errors.tag && (
                                <span className="font-rajdhani text-xs text-gh-red">
                                    {errors.tag.message}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Game select */}
                    <div className="flex flex-col gap-2">
                        <label className="font-mono text-[11px] tracking-[2px] uppercase text-gh-muted">
                            Primary Game
                        </label>
                        <select
                            {...register('game')}
                            className="w-full bg-gh-card2 border border-gh-border text-gh-text font-rajdhani text-base px-4 py-3 outline-none transition-colors focus:border-gh-purple"
                        >
                            <option value="">Select a game...</option>
                            {GAMES.map(g => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>
                        {errors.game && (
                            <span className="font-rajdhani text-xs text-gh-red">
                                {errors.game.message}
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-2">
                        <label className="font-mono text-[11px] tracking-[2px] uppercase text-gh-muted">
                            Description
                        </label>
                        <textarea
                            {...register('description')}
                            placeholder="Tell others about your team..."
                            rows={3}
                            className="w-full bg-gh-card2 border border-gh-border text-gh-text font-rajdhani text-base px-4 py-3 outline-none transition-colors focus:border-gh-purple placeholder:text-gh-faint resize-none"
                        />
                        {errors.description && (
                            <span className="font-rajdhani text-xs text-gh-red">
                                {errors.description.message}
                            </span>
                        )}
                        <span className="font-mono text-[10px] text-gh-faint text-right">
                            Max 200 characters
                        </span>
                    </div>

                    {/* Logo upload */}
                    <div className="flex flex-col gap-2">
                        <label className="font-mono text-[11px] tracking-[2px] uppercase text-gh-muted">
                            Team Logo (optional)
                        </label>
                        <div
                            onClick={() => logoInputRef.current?.click()}
                            className="w-full bg-gh-card2 border border-dashed border-gh-border text-gh-faint font-rajdhani text-sm px-4 py-6 text-center cursor-pointer hover:border-gh-purple transition-colors"
                        >
                            Click to upload team logo
                            <div className="font-mono text-[10px] mt-1 text-gh-faint">
                                PNG, JPG up to 2MB
                            </div>
                        </div>
                        <input
                            ref={logoInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-[rgba(255,34,0,0.08)] border border-gh-red px-4 py-3">
                            <p className="font-rajdhani text-sm text-gh-red">{error}</p>
                        </div>
                    )}

                    {/* Success */}
                    {success && (
                        <div className="bg-[rgba(34,197,94,0.08)] border border-green-500 px-4 py-3">
                            <p className="font-rajdhani text-sm text-green-500">{success}</p>
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-primary w-full font-bebas tracking-widest text-lg py-3"
                    >
                        {isLoading ? 'CREATING TEAM...' : 'CREATE TEAM'}
                    </button>
                </form>
            </div>
        </div>
    )
}