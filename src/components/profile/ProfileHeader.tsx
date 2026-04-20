import { useRef } from 'react'
import { useAuthContext } from '@/context/AuthContext'
import { useProfile } from '@/hooks/useProfile'
import { TokenBadge } from '@/components/ui/TokenBadge'

export function ProfileHeader() {
    const { user } = useAuthContext()
    const { uploadAvatar, isLoading } = useProfile()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleAvatarClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        await uploadAvatar(file)
    }

    return (
        <div className="bg-gh-card border border-gh-border clip-lg p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

                {/* Avatar */}
                <div className="relative flex-shrink-0">
                    <div
                        onClick={handleAvatarClick}
                        className="w-24 h-24 rounded-full border-2 border-gh-purple bg-gh-purple/20 flex items-center justify-center cursor-pointer overflow-hidden group"
                    >
                        {user?.avatarUrl ? (
                            <img
                                src={user.avatarUrl}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="font-bebas text-4xl text-gh-purple">
                                {user?.username?.charAt(0).toUpperCase() ?? 'P'}
                            </span>
                        )}

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <span className="font-mono text-[10px] text-white tracking-widest">
                                {isLoading ? 'UPLOADING...' : 'CHANGE'}
                            </span>
                        </div>
                    </div>

                    {/* Hidden file input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />

                    {/* Online indicator */}
                    <div className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-gh-card" />
                </div>

                {/* User info */}
                <div className="flex-1 text-center sm:text-left">
                    <h1 className="font-bebas text-3xl sm:text-4xl tracking-widest text-gh-text leading-none">
                        {user?.username ?? 'Player'}
                    </h1>
                    <p className="font-mono text-xs text-gh-faint tracking-widest mt-1">
                        {user?.email}
                    </p>
                    <p className="font-mono text-[11px] text-gh-muted tracking-wider mt-1">
                        Member since {user?.joinedAt
                            ? new Date(user.joinedAt).toLocaleDateString('en-NG', {
                                year: 'numeric',
                                month: 'long',
                            })
                            : '2025'}
                    </p>

                    {/* Token balance */}
                    <div className="flex items-center gap-3 mt-4 justify-center sm:justify-start">
                        <TokenBadge amount={user?.tokens ?? 0} />
                        <span className="font-mono text-[11px] text-gh-faint tracking-wider">
                            GAMINGHUB TOKENS
                        </span>
                    </div>
                </div>

                {/* Edit profile button */}
                <div className="flex-shrink-0">
                    <a href="#edit">
                        <button className="btn-outline font-bebas tracking-widest text-sm px-5 py-2">
                            EDIT PROFILE
                        </button>
                    </a>
                </div>
            </div>
        </div>
    )
}