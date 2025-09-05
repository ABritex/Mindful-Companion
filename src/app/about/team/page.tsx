import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import Image from "next/image"
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export default function TeamPage() {
    const placeholderSrc = "/api/placeholder/120/120"

    function MemberCard({ name, role, note }: { name: string; role: string; note?: string }) {
        return (
            <div className="group bg-[var(--color-background)] rounded-xl border border-[var(--color-muted)] shadow-sm hover:shadow-lg hover:border-[var(--color-muted-foreground)] transition-all duration-300 overflow-hidden">
                <div className="flex flex-col items-center text-center p-8">
                    <div className="relative h-28 w-28 mb-6">
                        <div className="h-28 w-28 overflow-hidden rounded-full ring-4 ring-primary/20 group-hover:ring-primary/30 transition-all duration-300">
                            <Image
                                src={placeholderSrc}
                                alt={`${name} - ${role}`}
                                width={112}
                                height={112}
                                className="h-28 w-28 object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-300"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 mb-6">
                        <h3 className="text-lg font-semibold text-[var(--color-foreground)] leading-tight">{name}</h3>
                        <p className="text-sm font-medium text-[var(--color-primary)]">{role}</p>
                        {note && (
                            <p className="text-xs text-[var(--color-muted-foreground)] italic">{note}</p>
                        )}
                    </div>

                    <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed mb-6 line-clamp-4">
                        Dedicated professional with expertise in research methodology, data analysis, and academic excellence. Committed to advancing knowledge and fostering innovation in the field.
                    </p>

                    <div className="flex items-center gap-4 text-[var(--color-muted-foreground)]">
                        <Facebook size={18} className="hover:text-[var(--color-primary)] cursor-pointer transition-colors duration-200" />
                        <Twitter size={18} className="hover:text-[var(--color-primary)] cursor-pointer transition-colors duration-200" />
                        <Instagram size={18} className="hover:text-[var(--color-primary)] cursor-pointer transition-colors duration-200" />
                        <Linkedin size={18} className="hover:text-[var(--color-primary)] cursor-pointer transition-colors duration-200" />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[var(--color-background)]">
            <div className="container mx-auto px-4 py-4">
                {/* Breadcrumb Navigation */}
                <div className="mb-8">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/" className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/about" className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]">About</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-[var(--color-primary)] font-medium">Our Team</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-[var(--color-foreground)] mb-4">Our Team</h1>
                    <div className="w-24 h-1 bg-[var(--color-primary)] mx-auto mb-6"></div>
                    <p className="text-lg text-[var(--color-muted-foreground)] max-w-3xl mx-auto leading-relaxed">
                        Meet the dedicated professionals driving our research forward. Our diverse team brings together expertise,
                        innovation, and passion to deliver exceptional results and advance knowledge in our field.
                    </p>
                </div>

                <div className="space-y-20">
                    {/* Research Team */}
                    <section>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-[var(--color-foreground)] mb-3">Research Team</h2>
                            <p className="text-[var(--color-muted-foreground)] max-w-2xl mx-auto">
                                Our core research team consists of dedicated investigators committed to advancing knowledge through rigorous methodology and innovative approaches.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 max-w-7xl mx-auto">
                            <MemberCard name="Nicholas John C. Abeleda" role="Programmer" />
                            <MemberCard name="Luke Joseph V. Lomboy" role="Designer" />
                            <MemberCard name="Curt David T. Gamil" role="Leader" />
                            <MemberCard name="Miedhel Joyce C. Clemente" role="Designer" />
                            <MemberCard name="Angeline T. Abarcar" role="Papers" />
                        </div>
                    </section>

                    {/* Advisory Team */}
                    <section>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-[var(--color-foreground)] mb-3">Advisory Team</h2>
                            <p className="text-[var(--color-muted-foreground)] max-w-2xl mx-auto">
                                Our experienced advisory team provides guidance, expertise, and critical oversight to ensure the highest standards of academic excellence.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                            <MemberCard name="Dr. Kris" role="Research Adviser" />
                            <MemberCard name="Dr. Virgino" role="Critical Reader" />
                            <MemberCard name="Sir. Ariel" role="Data Analyst" />
                        </div>
                    </section>

                    {/* Review Panel */}
                    <section>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-[var(--color-foreground)] mb-3">Review Panel</h2>
                            <p className="text-[var(--color-muted-foreground)] max-w-2xl mx-auto">
                                Our distinguished panel of experts provides comprehensive evaluation and feedback to maintain the integrity and quality of our research outcomes.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
                            <MemberCard name="Ma'am. Tes" role="Panel Chair" />
                            <MemberCard name="Sir. Gie" role="Panel Member" />
                            <MemberCard name="Dr. Amahan" role="Panel Member" />
                            <MemberCard name="Sir. Joel" role="Academic Advisor" note="Class Supervisor" />
                        </div>
                    </section>
                </div>

                {/* Footer CTA */}
                <div className="text-center mt-20 pt-16 border-t border-[var(--color-muted)]">
                    <p className="text-[var(--color-muted-foreground)] mb-4">Interested in collaborating with our team?</p>
                    <button className="bg-[var(--color-primary)] text-[var(--color-primary-foreground)] px-8 py-3 rounded-lg font-medium hover:brightness-110 transition-colors duration-200">
                        Get In Touch
                    </button>
                </div>
            </div>
        </div>
    )
}