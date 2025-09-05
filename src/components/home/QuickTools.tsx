import { Button } from "@/components/ui/button";
import Link from "next/link";

export function QuickTools() {
    return (
        <section className="py-16 px-4">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-2xl font-bold mb-4">Try Our Free Tools</h2>
                <p className="mb-8 text-muted-foreground">Jump right in with these quick, helpful resources.</p>
                <div className="flex flex-wrap justify-center gap-4">
                    <Button variant="secondary" asChild>
                        <Link href="/mood-check">Quick Mood Check</Link>
                    </Button>
                    <Button variant="secondary" asChild>
                        <Link href="/breathing">Breathing Exercise</Link>
                    </Button>
                    <Button variant="secondary" asChild>
                        <Link href="/journal">Daily Journal</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
} 