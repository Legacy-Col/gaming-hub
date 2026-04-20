import { useState } from "react";
import { DashboardTop } from "@/components/dashboard/DashboardTop"
import { DashboardSide } from "@/components/dashboard/DashboardSide"
import { StatsCards } from "@/components/dashboard/StatsCard"
import { ActiveTourney } from "@/components/dashboard/ActiveTourney"
import { TeamStats } from "@/components/dashboard/TeamStates"



type ActiveSection = 'overview' | 'tournaments' | 'rankings' | 'store' | 'profile'

export function DashboardPage() {
    const [activeSection, setActiveSection] = useState<ActiveSection>('overview')
    const [sideBarOpen, setSideBarOpen] = useState(false)

    return (
        <div className="min-h-screen bg-gh-bg flex flex-col ">
            {/*Top Bar*/}

            <DashboardTop
                onMenuToggle={() => setSideBarOpen(open => !open)}
            />

            <div className="flex flex-1 overflow-hidden">

                { /*Sidebar*/}
                <DashboardSide
                    activeSection={activeSection}
                    onSectionChange={(state: ActiveSection | ((prevState: ActiveSection) => ActiveSection)) => {
                        setActiveSection(state)
                        setSideBarOpen(false)
                    }}
                    isOpen={sideBarOpen}
                />

                {/*Main Content*/}

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {activeSection === 'overview' && (
                        <div className="flex flex-col gap-6">
                            <StatsCards />
                            <ActiveTourney />
                            <TeamStats />
                        </div>
                    )}

                    {activeSection === 'tournaments' && <ActiveTourney />}
                    {activeSection === 'rankings' && <TeamStats />}
                    {activeSection === 'store' && (
                        <div className="flex items-center justify-center h-64">
                            <p className="font-rajdhani text-gh-muted tracking-wider"> Store coming Soon....</p>
                        </div>
                    )}

                    {activeSection === 'profile' && (
                        <div className="flex items-center justify-center h-64">
                            <p className="font-rajdhani text-gh-muted tracking-wider">
                                Profile coming soon...
                            </p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

export { DashboardTop };

