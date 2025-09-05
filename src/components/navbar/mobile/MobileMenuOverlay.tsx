import * as React from "react"
import Link from "next/link"
import { X as CloseIcon, ChevronDown, ChevronUp } from "lucide-react"
import { Portal } from "@/components/Portal"
import { NAV_ITEMS } from "@/components/navbar/nav-items"

interface MobileMenuOverlayProps {
    open: boolean
    onClose: () => void
    user: {
        id: string
        email: string
        name: string | null
        role: "admin" | "user"
    } | null
}

export function MobileMenuOverlay({ open, onClose, user }: MobileMenuOverlayProps) {
    const [expanded, setExpanded] = React.useState<string | null>(null)
    React.useEffect(() => {
        if (!open) return;
        function handleResize() {
            if (window.innerWidth >= 768) onClose();
        }
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [open, onClose]);

    if (!open) return null;
    return (
        <Portal>
            <div className="fixed inset-0 z-[20000] min-h-screen w-screen flex flex-col animate-slide-in-down">
                <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ background: 'linear-gradient(120deg, #232946 0%, #6a8caf 100%)', opacity: 1, zIndex: 0, }} />
                <button className="absolute top-4 left-3 h-10 w-10 flex items-center justify-center rounded-md text-white hover:bg-white/10 transition z-[21000]"
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    onTouchEnd={(e) => {
                        e.stopPropagation();
                        onClose();
                    }} aria-label="Close menu" tabIndex={0}>
                    <CloseIcon className="h-6 w-6" />
                </button>
                <nav className="flex-1 flex flex-col justify-center items-start gap-6 pl-6 pr-10 z-20">
                    {NAV_ITEMS.map((section, i) => (
                        <div key={section.section} className="w-full">
                            <button className="flex items-center gap-2 text-3xl font-semibold text-white hover:text-primary transition w-full text-left py-2" onClick={() => setExpanded(expanded === section.section ? null : section.section)} aria-expanded={expanded === section.section} aria-controls={`section-links-${i}`}    >
                                {section.section.charAt(0).toUpperCase() + section.section.slice(1)}
                                {expanded === section.section ? <ChevronUp className="ml-2 h-6 w-6" /> : <ChevronDown className="ml-2 h-6 w-6" />}
                            </button>
                            {expanded === section.section && (
                                <div id={`section-links-${i}`} className="flex flex-col gap-2 pl-4 mt-2">
                                    {section.links.map(link => (
                                        <Link key={link.href} href={link.href} onClick={e => { e.preventDefault(); onClose(); window.location.href = link.href; }} className="text-2xl font-light text-white hover:text-primary transition text-left py-1"  >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    {user && (
                        <Link href="/profile" onClick={e => { e.preventDefault(); onClose(); window.location.href = "/profile"; }} className="text-3xl font-semibold text-white hover:text-primary transition text-left py-2 mt-4" >
                            Profile
                        </Link>
                    )}
                </nav>
                <div className="flex flex-col gap-2 px-6 pb-8 z-20">
                    <div className="flex gap-4 text-gray-400 text-base">
                        <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Twitter</a>
                        <span>/</span>
                        <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Instagram</a>
                    </div>
                    <a href="/privacy" className="text-gray-400 text-base hover:text-white transition">Privacy Policy</a>
                    <div className="mt-8 text-[2.5rem] font-bold tracking-tight text-white opacity-10 select-none">MINDFUL</div>
                </div>
                <style>{`
                    @keyframes slide-in-down {
                        from { transform: translateY(-100%); opacity: 0.7; }
                        to { transform: translateY(0); opacity: 1; }
                    }
                    .animate-slide-in-down {
                        animation: slide-in-down 0.7s cubic-bezier(.4,0,.2,1);
                    }
                `}</style>
            </div>
        </Portal>
    )
} 