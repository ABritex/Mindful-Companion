import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RainbowButton } from "@/components/ui/rainbow-button";

export function AuthButtons() {
    return (
        <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
                <Link href="/sign-in">Sign In</Link>
            </Button>
            <RainbowButton asChild size="sm" variant="default">
                <Link href="/sign-up">Sign Up</Link>
            </RainbowButton>
        </div>
    );
} 