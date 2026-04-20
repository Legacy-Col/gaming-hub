import { useAuthContext } from "@/context/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import LogoImg from '@/assets/hub.jpeg';
import { Link } from "react-router-dom";
import { TokenBadge } from "../ui/TokenBadge";


interface DashboardTopProps {
    onMenuToggle: () => void
}



export function DashboardTop({ onMenuToggle }: (DashboardTopProps)) {
    const { user } = useAuthContext();
    const { handleLogout } = useAuth();


    return (
        <header className="h-16 bg-gh-card border-b border-gh-border flex items-center justify-between px-4 sm:px-6 sticky top-0 z-50">
            {/* Left — hamburger + logo */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuToggle}
                    className="md:hidden flex flex-col gap-1.5 p-2 cursor-pointer"
                    aria-label="Toggle menu"
                >
                    <span className="block w-5 h-0.5 bg-gh-text" />
                    <span className="block w-5 h-0.5 bg-gh-text" />
                    <span className="block w-5 h-0.5 bg-gh-text" />
                </button>
                <Link to="/">
                    <img
                        src={LogoImg}
                        alt="Gaming Hub Africa"
                        className="h-9 w-auto object-contain"
                        style={{ mixBlendMode: 'screen' }}
                    />
                </Link>
            </div>

            {/* Center — page title */}
            <span className="font-bebas text-xl tracking-widest text-gh-muted hidden sm:block">
                DASHBOARD
            </span>

            {/* Right — user info + logout */}
            <div className="flex items-center gap-3 sm:gap-4">
                {/* Username */}
                <div className="hidden sm:flex flex-col items-end">
                    <Link to="/profile" className="hidden sm:flex flex-col items-end group">
                        <span className="font-rajdhani font-bold text-sm text-gh-text leading-none group-hover:text-gh-purple transition-colors">
                            {user?.username ?? 'Player'}
                        </span>
                        <span className="font-mono text-[10px] text-gh-faint tracking-wider mt-0.5">
                            {user?.email}
                        </span>
                    </Link>
                </div>

                {/* Token balance */}
                <TokenBadge amount={user?.tokens ?? 0} />

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="btn-outline font-bebas tracking-widest text-sm px-3 py-1.5"
                >
                    LOGOUT
                </button>
            </div>
        </header>
    )
}