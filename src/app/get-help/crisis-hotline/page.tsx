import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

export default function GetHelpCrisisHotlinePage() {
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
                        <BreadcrumbPage>Crisis Hotline</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <h1 className="text-3xl font-bold mt-4 mb-6">Crisis Hotline</h1>
            <p className="text-muted-foreground mb-4">Mga numerong maaari mong tawagan para sa agarang tulong.</p>
            <ul className="list-disc pl-6 space-y-2">
                <li>
                    <span className="font-semibold">Emergency (911):</span> Tumawag para sa agarang tulong medikal, pulis, o bumbero.
                </li>
            </ul>
        </div>
    )
} 