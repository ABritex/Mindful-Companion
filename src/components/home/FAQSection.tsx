"use client"

import { useState } from "react";

const faqs = [
    {
        q: "Is my data private and secure?",
        a: "Absolutely. We use end-to-end encryption and comply with HIPAA and ISO 27001 standards."
    },
    {
        q: "Can I talk to a real therapist?",
        a: "Yes! You can choose between AI chat and licensed professionals."
    },
    {
        q: "How much does it cost?",
        a: "Basic features are free. Premium support is available for a subscription."
    },
];

export function FAQSection() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    return (
        <section className="py-20 px-4">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12">Common Questions</h2>
                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div key={i} className="border rounded-lg bg-card">
                            <button
                                className="w-full flex justify-between items-center px-6 py-4 text-left font-medium text-foreground focus:outline-none"
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                aria-expanded={openFaq === i}
                            >
                                <span>{faq.q}</span>
                                <span className="ml-4 text-xl">{openFaq === i ? "-" : "+"}</span>
                            </button>
                            {openFaq === i && (
                                <div className="px-6 pb-4 text-muted-foreground text-sm animate-fade-in">
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
} 