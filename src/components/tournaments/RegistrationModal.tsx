import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthContext } from '@/context/AuthContext'
import { api } from '@/lib/api'
import type { RegistrationType } from '@/types'

interface RegistrationModalProps {
    tournamentId: string
    tournamentTitle: string
    entryFee: string | null
    tokenCost?: number
    onClose: () => void
    onSuccess: () => void
}

const teamSchema = z.object({
    teamId: z.string().min(1, 'Please enter your team ID'),
})

const individualSchema = z.object({
    playerName: z.string().min(2, 'Name must be at least 2 characters'),
    gameTag: z.string().min(2, 'Game tag must be at least 2 characters'),
})

type TeamFormData = z.infer<typeof teamSchema>
type IndividualFormData = z.infer<typeof individualSchema>

export function RegistrationModal({
    tournamentId, tournamentTitle, entryFee, tokenCost, onClose, onSuccess,
}: RegistrationModalProps) {
    const { isAuthenticated } = useAuthContext()
    const [type, setType] = useState<RegistrationType>('team')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const teamForm = useForm<TeamFormData>({
        resolver: zodResolver(teamSchema),
    })

    const individualForm = useForm<IndividualFormData>({
        resolver: zodResolver(individualSchema),
    })

    const handleSubmit = async (data: TeamFormData | IndividualFormData) => {
        try {
            setIsLoading(true)
            setError(null)

            // ── MOCK — remove when backend is ready ──
            if (!import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL.includes('localhost')) {
                await new Promise(resolve => setTimeout(resolve, 1500))
                onSuccess()
                return
            }
            // ── END MOCK ──

            await api.tournaments.register({
                tournamentId,
                type,
                ...(type === 'team'
                    ? { teamId: (data as TeamFormData).teamId }
                    : {
                        playerName: (data as IndividualFormData).playerName,
                        gameTag: (data as IndividualFormData).gameTag,
                    }),
            })
            onSuccess()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed')
        } finally {
            setIsLoading(false)
        }
    }

    if (!isAuthenticated) {
        return (
            <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
                <div className="bg-gh-card border border-gh-border p-8 clip-lg w-full max-w-md text-center">
                    <h2 className="font-bebas text-3xl tracking-widest text-gh-text mb-3">
                        LOGIN REQUIRED
                    </h2>
                    <p className="font-rajdhani text-gh-muted text-sm mb-6">
                        You need to be logged in to register for tournaments.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <a href="/login">
                            <button className="btn-primary font-bebas tracking-widest px-6 py-2">
                                LOG IN
                            </button>
                        </a>
                        <button onClick={onClose} className="btn-outline font-bebas tracking-widest px-6 py-2">
                            CANCEL
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
            <div className="bg-gh-card border border-gh-border p-6 sm:p-8 clip-lg w-full max-w-md">

                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <div className="font-mono text-[10px] tracking-[3px] text-gh-purple mb-1">
                            // REGISTRATION
                        </div>
                        <h2 className="font-bebas text-2xl tracking-widest text-gh-text leading-tight">
                            {tournamentTitle}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gh-faint hover:text-gh-text transition-colors font-mono text-lg"
                    >
                        ✕
                    </button>
                </div>

                {/* Entry fee info */}
                <div className="flex gap-3 mb-6">
                    {entryFee && (
                        <div className="bg-gh-card2 border border-gh-border px-3 py-2 flex-1 text-center">
                            <div className="font-mono text-[10px] text-gh-faint tracking-wider mb-1">CASH ENTRY</div>
                            <div className="font-bebas text-xl text-gh-red">{entryFee}</div>
                        </div>
                    )}
                    {tokenCost && (
                        <div className="bg-[rgba(255,184,0,0.08)] border border-gh-gold-dim px-3 py-2 flex-1 text-center">
                            <div className="font-mono text-[10px] text-gh-faint tracking-wider mb-1">TOKEN ENTRY</div>
                            <div className="font-bebas text-xl text-gh-gold">◈ {tokenCost}</div>
                        </div>
                    )}
                </div>

                {/* Registration type toggle */}
                <div className="flex gap-2 mb-6">
                    {(['team', 'individual'] as RegistrationType[]).map(t => (
                        <button
                            key={t}
                            onClick={() => setType(t)}
                            className={[
                                'flex-1 font-bebas tracking-widest text-sm py-2 border clip-sm transition-colors',
                                type === t
                                    ? 'border-gh-purple text-gh-purple bg-[rgba(123,47,190,0.12)]'
                                    : 'border-gh-border text-gh-muted hover:border-gh-purple hover:text-gh-purple',
                            ].join(' ')}
                        >
                            {t === 'team' ? 'REGISTER AS TEAM' : 'REGISTER AS INDIVIDUAL'}
                        </button>
                    ))}
                </div>

                {/* Team form */}
                {type === 'team' && (
                    <form
                        onSubmit={teamForm.handleSubmit(handleSubmit)}
                        className="flex flex-col gap-4"
                    >
                        <div className="flex flex-col gap-2">
                            <label className="font-mono text-[11px] tracking-[2px] uppercase text-gh-muted">
                                Team ID
                            </label>
                            <input
                                {...teamForm.register('teamId')}
                                placeholder="Enter your team ID"
                                className="w-full bg-gh-card2 border border-gh-border text-gh-text font-rajdhani text-base px-4 py-3 outline-none transition-colors focus:border-gh-purple placeholder:text-gh-faint"
                            />
                            {teamForm.formState.errors.teamId && (
                                <span className="font-rajdhani text-xs text-gh-red">
                                    {teamForm.formState.errors.teamId.message}
                                </span>
                            )}
                        </div>

                        {error && (
                            <div className="bg-[rgba(255,34,0,0.08)] border border-gh-red px-4 py-3">
                                <p className="font-rajdhani text-sm text-gh-red">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary font-bebas tracking-widest text-lg py-3 w-full"
                        >
                            {isLoading ? 'REGISTERING...' : 'CONFIRM REGISTRATION'}
                        </button>
                    </form>
                )}

                {/* Individual form */}
                {type === 'individual' && (
                    <form
                        onSubmit={individualForm.handleSubmit(handleSubmit)}
                        className="flex flex-col gap-4"
                    >
                        <div className="flex flex-col gap-2">
                            <label className="font-mono text-[11px] tracking-[2px] uppercase text-gh-muted">
                                Player Name
                            </label>
                            <input
                                {...individualForm.register('playerName')}
                                placeholder="Enter your name"
                                className="w-full bg-gh-card2 border border-gh-border text-gh-text font-rajdhani text-base px-4 py-3 outline-none transition-colors focus:border-gh-purple placeholder:text-gh-faint"
                            />
                            {individualForm.formState.errors.playerName && (
                                <span className="font-rajdhani text-xs text-gh-red">
                                    {individualForm.formState.errors.playerName.message}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-mono text-[11px] tracking-[2px] uppercase text-gh-muted">
                                Game Tag
                            </label>
                            <input
                                {...individualForm.register('gameTag')}
                                placeholder="e.g. Kaizen#1234"
                                className="w-full bg-gh-card2 border border-gh-border text-gh-text font-rajdhani text-base px-4 py-3 outline-none transition-colors focus:border-gh-purple placeholder:text-gh-faint"
                            />
                            {individualForm.formState.errors.gameTag && (
                                <span className="font-rajdhani text-xs text-gh-red">
                                    {individualForm.formState.errors.gameTag.message}
                                </span>
                            )}
                        </div>

                        {error && (
                            <div className="bg-[rgba(255,34,0,0.08)] border border-gh-red px-4 py-3">
                                <p className="font-rajdhani text-sm text-gh-red">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary font-bebas tracking-widest text-lg py-3 w-full"
                        >
                            {isLoading ? 'REGISTERING...' : 'CONFIRM REGISTRATION'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}