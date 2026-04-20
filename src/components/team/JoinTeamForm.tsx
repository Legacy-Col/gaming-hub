import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTeam } from '@/hooks/useTeam'
import { joinTeamSchema, type JoinTeamData } from '@/schemas/TeamSchemas'

export function JoinTeamForm() {
    const { joinTeam, isLoading, error, success } = useTeam()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<JoinTeamData>({
        resolver: zodResolver(joinTeamSchema),
        mode: 'onBlur',
    })

    const onSubmit = async (data: JoinTeamData) => {
        await joinTeam(data.teamId)
    }

    return (
        <div>
            {/* Section header */}
            <div className="border-l-[3px] border-gh-gold pl-4 mb-6">
                <div className="font-mono text-[11px] tracking-[3px] text-gh-gold mb-1">
                    // JOIN
                </div>
                <h2 className="font-bebas text-3xl tracking-widest text-gh-text">
                    JOIN A TEAM
                </h2>
            </div>

            <div className="bg-gh-card border border-gh-border p-6 sm:p-8 clip-lg">
                <p className="font-rajdhani text-gh-muted text-sm leading-relaxed mb-6">
                    Ask your team captain for the Team ID and enter it below to request to join their squad.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="font-mono text-[11px] tracking-[2px] uppercase text-gh-muted">
                            Team ID
                        </label>
                        <input
                            {...register('teamId')}
                            placeholder="Enter the team ID"
                            className="w-full bg-gh-card2 border border-gh-border text-gh-text font-rajdhani text-base px-4 py-3 outline-none transition-colors focus:border-gh-gold placeholder:text-gh-faint"
                        />
                        {errors.teamId && (
                            <span className="font-rajdhani text-xs text-gh-red">
                                {errors.teamId.message}
                            </span>
                        )}
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

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-gold w-full font-bebas tracking-widest text-lg py-3"
                    >
                        {isLoading ? 'JOINING...' : 'REQUEST TO JOIN'}
                    </button>
                </form>
            </div>
        </div>
    )
}