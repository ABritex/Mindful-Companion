import Link from "next/link"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

export default function SelfHelpIndexPage() {
    return (
        <div className="container mx-auto p-4">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/resources">Resources</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Self-Help Tools</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <h1 className="text-3xl font-bold mt-4 mb-6">Self-Help Tools</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Link href="/resources/self-help/guided-meditation" className="block bg-muted rounded-xl p-6 shadow hover:shadow-lg transition-all border border-transparent hover:border-primary">
                    <h2 className="text-2xl font-semibold mb-2 text-primary">Guided Meditation</h2>
                </Link>
                <Link href="/resources/self-help/breathing-exercises" className="block bg-muted rounded-xl p-6 shadow hover:shadow-lg transition-all border border-transparent hover:border-primary">
                    <h2 className="text-2xl font-semibold mb-2 text-primary">Breathing Techniques</h2>
                </Link>
            </div>
        </div>
    )
} 