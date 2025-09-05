import { HeroSection } from "@/components/home/HeroSection"
import { FAQSection } from "@/components/home/FAQSection"
import { QuickTools } from "@/components/home/QuickTools"

export default function HomePage() {
    return (
        <>
            {/* Animated Gradient Background with Floating Blobs */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-gradient-to-br from-primary/30 via-accent/30 to-secondary/30 rounded-full blur-3xl opacity-60 animate-blob-float-1" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] bg-gradient-to-tr from-accent/40 via-primary/20 to-secondary/40 rounded-full blur-2xl opacity-50 animate-blob-float-2" />
                <div className="absolute top-[30%] right-[-5%] w-[250px] h-[250px] bg-gradient-to-tl from-secondary/30 via-accent/20 to-primary/30 rounded-full blur-2xl opacity-40 animate-blob-float-3" />
            </div>

            <HeroSection />
            <QuickTools />
            <FAQSection />
        </>
    )
} 