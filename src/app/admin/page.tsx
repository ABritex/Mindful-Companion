import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AITestComponent } from "@/components/AITestComponent"

export default function AdminPage() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl mb-8">Admin Dashboard</h1>

            <div className="grid gap-6 mb-8">
                <div className="flex gap-4">
                    <Button asChild>
                        <Link href="/">Home</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/admin/seed">Database Seeding</Link>
                    </Button>
                </div>
            </div>

            <AITestComponent />
        </div>
    )
}