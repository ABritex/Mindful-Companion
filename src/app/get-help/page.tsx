import Link from "next/link"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

export default function GetHelpIndexPage() {
    return (
        <div className="container mx-auto p-4">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Get Help</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <h1 className="text-4xl font-bold mt-4 mb-8">Get Help</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Link href="/get-help/crisis-hotline" className="block bg-muted rounded-xl p-6 shadow hover:shadow-lg transition-all border border-transparent hover:border-primary">
                    <h2 className="text-2xl font-semibold mb-2 text-primary">Crisis Hotline</h2>
                </Link>
                <Link href="/get-help/emergency" className="block bg-muted rounded-xl p-6 shadow hover:shadow-lg transition-all border border-transparent hover:border-primary">
                    <h2 className="text-2xl font-semibold mb-2 text-primary">Emergency Services</h2>
                </Link>
                <Link href="/get-help/immediate-help" className="block bg-muted rounded-xl p-6 shadow hover:shadow-lg transition-all border border-transparent hover:border-primary">
                    <h2 className="text-2xl font-semibold mb-2 text-primary">Immediate Help</h2>
                </Link>
            </div>
        </div>
    )
} 