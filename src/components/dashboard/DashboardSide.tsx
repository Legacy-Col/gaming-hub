import { useAuthContext } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'

type ActiveSection = 'overview' | 'tournaments' | 'rankings' | 'store' | 'profile'

interface DashboardSidebarProps {
    activeSection: ActiveSection
    onSectionChange: (section: ActiveSection) => void
    isOpen: boolean
}

const NAV_ITEMS: { label: string; section: ActiveSection; icon: string }[] = [
    { label: 'Overview', section: 'overview', icon: '⊞' },
    { label: 'Tournaments', section: 'tournaments', icon: '⚔' },
    { label: 'Rankings', section: 'rankings', icon: '🏆' },
    { label: 'Store', section: 'store', icon: '🎮' },
    { label: 'Profile', section: 'profile', icon: '👤' },
]

export function DashboardSide({ activeSection, onSectionChange, isOpen }: DashboardSidebarProps) {
    const { user } = useAuthContext();
    const navigate = useNavigate();

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/60 z-30 md:hidden" />
            )}

            {/* Sidebar */}
            <aside className={[
                'fixed md:sticky top-16 left-0 h-[calc(100vh-4rem)]',
                'w-64 bg-gh-card border-r border-gh-border',
                'flex flex-col z-40 transition-transform duration-300',
                isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
            ].join(' ')}>

                {/* User profile block */}
                <div className="p-6 border-b border-gh-border">
                    <div className="w-14 h-14 rounded-full bg-gh-purple/20 border-2 border-gh-purple flex items-center justify-center mb-3">
                        <span className="font-bebas text-2xl text-gh-purple">
                            {user?.username?.charAt(0).toUpperCase() ?? 'P'}
                        </span>
                    </div>
                    <div className="font-rajdhani font-bold text-base text-gh-text leading-none">
                        {user?.username ?? 'Player'}
                    </div>
                    <div className="font-mono text-[11px] text-gh-faint mt-1 tracking-wider">
                        Member since {user?.joinedAt
                            ? new Date(user.joinedAt).getFullYear()
                            : '2025'}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 flex flex-col gap-1">
                    {NAV_ITEMS.map(item => (
                        <button
                            key={item.section}
                            onClick={() => {
                                if (item.section === 'profile') {
                                    navigate('/profile')  // ← navigate to profile page
                                } else {
                                    onSectionChange(item.section)
                                }
                            }}
                            className={[
                                'w-full flex items-center gap-3 px-4 py-3 text-left',
                                'font-rajdhani font-semibold text-sm tracking-wider uppercase',
                                'transition-all duration-150 clip-sm',
                                activeSection === item.section
                                    ? 'bg-gh-purple/20 text-gh-purple border border-gh-purple/40'
                                    : 'text-gh-muted hover:text-gh-text hover:bg-gh-card2 border border-transparent',
                            ].join(' ')}
                        >
                            <span className="text-base">{item.icon}</span>
                            {item.label}
                            {activeSection === item.section && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gh-purple" />
                            )}
                        </button>
                    ))}
                </nav>

                {/* Bottom — version tag */}
                <div className="p-4 border-t border-gh-border">
                    <span className="font-mono text-[10px] text-gh-faint tracking-widest">
                        GAMING HUB AFRICA v0.1
                    </span>
                </div>
            </aside>
        </>
    )
}