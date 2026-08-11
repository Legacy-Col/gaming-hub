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
import { Brands } from '@/components/Brands'
import { Countries } from '@/components/Countries'

export function LandingPage() {
    return (
        <>
            <Navbar />
            <main>
                <Hero />
                <Features />
                <Tournaments />
                <FeaturedTournament />
                <Brands />
                <Rankings />
                <Tokens />
                <Store />
                <Countries />
                <CTA />
            </main>
            <Footer />
        </>
    )
}