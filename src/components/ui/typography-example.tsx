import React from 'react';

export function TypographyExample() {
    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            {/* Headings with Century Gothic */}
            <div className="space-y-4">
                <h1 className="font-heading text-4xl">Main Heading (Century Gothic)</h1>
                <h2 className="font-heading text-3xl">Secondary Heading (Century Gothic)</h2>
                <h3 className="font-heading text-2xl">Tertiary Heading (Century Gothic)</h3>
            </div>

            {/* Body text with Helvetica */}
            <div className="space-y-4">
                <p className="font-body text-lg">
                    This is body text using Helvetica Regular. Helvetica is renowned for its
                    exceptional readability and clean, neutral design that works well for
                    extended reading.
                </p>

                <p className="font-body text-light text-base">
                    This is light weight Helvetica text, perfect for subtle information,
                    captions, or secondary content that shouldn't compete with the main text.
                </p>

                <p className="font-body text-bold text-base">
                    This is bold Helvetica text, ideal for emphasis, important information,
                    or call-to-action elements that need to stand out.
                </p>
            </div>

            {/* Mixed usage example */}
            <div className="bg-muted p-6 rounded-lg">
                <h4 className="font-heading text-xl mb-3">Feature Section</h4>
                <p className="font-body text-base">
                    This demonstrates how Century Gothic headings work beautifully with
                    Helvetica body text. The contrast creates a clear hierarchy while
                    maintaining excellent readability throughout.
                </p>
                <ul className="font-body text-base mt-3 space-y-1">
                    <li>• Helvetica for all body text and UI elements</li>
                    <li>• Century Gothic for headings and brand elements</li>
                    <li>• Consistent spacing and line heights</li>
                </ul>
            </div>

            {/* Font weight examples */}
            <div className="space-y-2">
                <p className="font-body text-light">Light weight (300) - Subtle text</p>
                <p className="font-body text-regular">Regular weight (400) - Body text</p>
                <p className="font-body text-bold">Bold weight (700) - Emphasis</p>
            </div>
        </div>
    );
} 