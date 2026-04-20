import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { TokenHistory } from '@/components/profile/TokenHistory'
import { ProfileEditForm } from '@/components/profile/ProfileEditForm'
import { Link } from 'react-router-dom'

export function ProfilePage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gh-bg px-4 sm:px-6 lg:px-12 py-24">
                <div className="max-w-4xl mx-auto flex flex-col gap-10">

                    <div>
                        <Link
                            to="/dashboard"
                            className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase text-gh-muted hover:text-gh-purple transition-colors"
                        >
                            ← Back to Dashboard
                        </Link>
                    </div>

                    <ProfileHeader />
                    <TokenHistory />
                    <ProfileEditForm />
                </div>
            </main>
            <Footer />
        </>
    )
}