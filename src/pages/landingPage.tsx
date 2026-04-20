import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { Features } from '@/components/Features'
import { Tournaments } from '@/components/Tournaments'
import { Rankings } from '@/components/Rankings'
import { Tokens } from '@/components/Tokens'
import { Store } from '@/components/Store'
import { CTA } from '@/components/CTA'
import { Footer } from '@/components/Footer'
import { FeaturedTournament } from '@/components/tournaments/FeaturedTournaments'

export function LandingPage() {
    return (
        <>
            <Navbar />
            <main>
                <Hero />
                <Features />
                <Tournaments />
                <FeaturedTournament />
                <Rankings />
                <Tokens />
                <Store />
                <CTA />
            </main>
            <Footer />
        </>
    )
}