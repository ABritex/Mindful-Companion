import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

export default function MissionVisionPage() {
    return (
        <div className="container mx-auto p-4">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/about">About</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Mission & Vision</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <h1 className="text-3xl font-bold mt-4 mb-6">Mission & Vision</h1>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">Our Goals</h2>
                <p className="text-muted-foreground">Enable accessible, compassionate, and proactive mental health support for our community.</p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-2">Our Vision</h2>
                <p className="text-muted-foreground">A campus where every individual feels supported, understood, and empowered to thrive.</p>
            </section>
        </div>
    )
} 