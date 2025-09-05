import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

export default function GetHelpEmergencyServicesPage() {
    return (
        <div className="container mx-auto p-4">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/get-help">Get Help</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Emergency Services</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <h1 className="text-3xl font-bold mt-4 mb-6">Emergency Services</h1>
            <ul className="list-disc pl-6 space-y-2">
                <li><span className="font-semibold">911</span> – Emergency hotline para sa agarang tulong</li>
                <li><span className="font-semibold">PNP</span> – Philippine National Police</li>
                <li><span className="font-semibold">VAWC</span> – Violence Against Women and Children helpdesk</li>
            </ul>
        </div>
    )
} 