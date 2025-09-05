import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

export default function GetHelpImmediateHelpPage() {
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
                        <BreadcrumbPage>Immediate Help</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <h1 className="text-3xl font-bold mt-4 mb-6">Immediate Help</h1>
            <ul className="list-disc pl-6 space-y-2">
                <li>Maam Madonna Ibay</li>
                <li>Emergency Services</li>
            </ul>
        </div>
    )
} 