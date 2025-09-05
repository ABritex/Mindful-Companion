import Link from "next/link"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

export default function ResourcesPage() {
    return (
        <div className="container mx-auto p-4">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Resources</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-4xl mb-8 mt-4 font-bold">Resources</h1>
            <p className="text-lg text-muted-foreground mb-8">Explore our collection of articles and videos to support your well-being and mental health journey.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Link href="/resources/articles" className="block bg-muted rounded-xl p-6 shadow hover:shadow-lg transition-all border border-transparent hover:border-primary">
                    <h2 className="text-2xl font-semibold mb-2 text-primary">Articles</h2>
                    <p className="text-muted-foreground">Read helpful articles on mental health, self-care, and personal growth.</p>
                </Link>
                <Link href="/resources/videos" className="block bg-muted rounded-xl p-6 shadow hover:shadow-lg transition-all border border-transparent hover:border-primary">
                    <h2 className="text-2xl font-semibold mb-2 text-primary">Videos</h2>
                    <p className="text-muted-foreground">Watch videos for guided practices, expert talks, and more.</p>
                </Link>

                <Link href="/resources/self-help" className="block bg-muted rounded-xl p-6 shadow hover:shadow-lg transition-all border border-transparent hover:border-primary">
                    <h2 className="text-2xl font-semibold mb-2 text-primary">Self-Help Tools</h2>
                    <p className="text-muted-foreground">Watch videos for guided practices, expert talks, and more.</p>
                </Link>
            </div>
        </div>
    )
} 