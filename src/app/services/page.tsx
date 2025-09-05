import Link from "next/link"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

export default function ServicesIndexPage() {
    return (
        <div className="container mx-auto p-4">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Services</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <h1 className="text-4xl font-bold mt-4 mb-8">Services</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Link href="/services/individual-therapy" className="block bg-muted rounded-xl p-6 shadow hover:shadow-lg transition-all border border-transparent hover:border-primary">
                    <h2 className="text-2xl font-semibold mb-2 text-primary">Individual Therapy</h2>
                </Link>
                <Link href="/services/online-programs" className="block bg-muted rounded-xl p-6 shadow hover:shadow-lg transition-all border border-transparent hover:border-primary">
                    <h2 className="text-2xl font-semibold mb-2 text-primary">Online Programs</h2>
                </Link>
            </div>
        </div>
    )
} 