import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/drizzle/db';
import { AIResponseTemplateTable } from '@/drizzle/schema';

const aiResponseTemplates = [
    // Happy responses
    {
        emotion: 'happy' as const,
        responseType: 'celebration',
        content: "I'm so glad to hear you're feeling happy! Your positive energy is contagious. What's bringing you this joy today?",
        copingStrategies: [
            "Share your joy with others",
            "Practice gratitude journaling",
            "Document this moment",
            "Express your happiness through creativity",
            "Help someone else feel good"
        ],
        priority: 1
    },
    {
        emotion: 'happy' as const,
        responseType: 'guidance',
        content: "It's wonderful that you're in such a positive mood! How can we make the most of this good energy?",
        copingStrategies: [
            "Channel your energy into productive activities",
            "Share your excitement with others",
            "Document your goals and plans",
            "Practice patience and planning"
        ],
        priority: 2
    },

    // Sad responses
    {
        emotion: 'sad' as const,
        responseType: 'comfort',
        content: "I'm sorry to hear you're feeling down. It's completely okay to feel sad sometimes. I'm here to listen and support you. What's on your mind?",
        copingStrategies: [
            "Take a walk in nature",
            "Listen to uplifting music",
            "Practice deep breathing exercises",
            "Talk to a friend or loved one",
            "Engage in gentle physical activity",
            "Write about your feelings"
        ],
        priority: 1
    },
    {
        emotion: 'sad' as const,
        responseType: 'guidance',
        content: "I understand that sadness can feel overwhelming. Remember that this feeling won't last forever. What would help you feel a little better right now?",
        copingStrategies: [
            "Practice self-compassion",
            "Engage in activities you usually enjoy",
            "Reach out to someone you trust",
            "Consider professional support if needed"
        ],
        priority: 2
    },

    // Anxious responses
    {
        emotion: 'anxious' as const,
        responseType: 'comfort',
        content: "I can sense that you're feeling anxious. Anxiety can be really overwhelming, but you're not alone in this. Let's take a moment to breathe together.",
        copingStrategies: [
            "Try the 4-7-8 breathing technique",
            "Write down your worries",
            "Practice progressive muscle relaxation",
            "Take a short break and stretch",
            "Use grounding techniques (5-4-3-2-1)",
            "Limit caffeine and screen time"
        ],
        priority: 1
    },
    {
        emotion: 'anxious' as const,
        responseType: 'guidance',
        content: "Anxiety often makes things feel bigger than they are. Let's break this down together. What specific worry is on your mind right now?",
        copingStrategies: [
            "Challenge anxious thoughts with evidence",
            "Focus on what you can control",
            "Practice mindfulness meditation",
            "Create a worry time schedule"
        ],
        priority: 2
    },

    // Angry responses
    {
        emotion: 'angry' as const,
        responseType: 'comfort',
        content: "I hear your frustration, and it's completely valid to feel angry. Anger is a natural emotion that tells us something isn't right. Let's work through this together.",
        copingStrategies: [
            "Count to 10 slowly",
            "Take deep breaths",
            "Go for a walk",
            "Write down what's bothering you",
            "Use physical exercise to release tension",
            "Practice mindfulness meditation"
        ],
        priority: 1
    },
    {
        emotion: 'angry' as const,
        responseType: 'guidance',
        content: "It's natural to feel angry when things don't go as expected. What triggered this feeling? Understanding the source can help us address it constructively.",
        copingStrategies: [
            "Identify the root cause of your anger",
            "Express your feelings assertively",
            "Practice problem-solving strategies",
            "Consider if the situation can be changed"
        ],
        priority: 2
    },

    // Stressed responses
    {
        emotion: 'stressed' as const,
        responseType: 'comfort',
        content: "I can feel that you're under a lot of stress right now. Stress can be overwhelming, but you're handling it better than you think. Let's take a moment to breathe.",
        copingStrategies: [
            "Prioritize your tasks",
            "Take regular breaks",
            "Practice time management",
            "Seek support from others",
            "Use stress-reduction techniques"
        ],
        priority: 1
    },
    {
        emotion: 'stressed' as const,
        responseType: 'guidance',
        content: "When stress feels overwhelming, it helps to break things down into smaller, manageable pieces. What's the most pressing concern right now?",
        copingStrategies: [
            "Create a priority list",
            "Delegate tasks when possible",
            "Set realistic expectations",
            "Practice stress management techniques"
        ],
        priority: 2
    },

    // Grateful responses
    {
        emotion: 'grateful' as const,
        responseType: 'celebration',
        content: "It's beautiful that you're feeling grateful! Gratitude is such a powerful emotion that can transform our perspective. What are you thankful for today?",
        copingStrategies: [
            "Express your gratitude to others",
            "Keep a gratitude journal",
            "Practice acts of kindness",
            "Reflect on positive experiences"
        ],
        priority: 1
    },

    // Calm responses
    {
        emotion: 'calm' as const,
        responseType: 'guidance',
        content: "It's wonderful that you're feeling calm and peaceful. This is a great state to be in for reflection and growth. How can we make the most of this peaceful energy?",
        copingStrategies: [
            "Maintain this peaceful state",
            "Practice mindfulness",
            "Engage in gentle activities",
            "Share your calm with others"
        ],
        priority: 1
    },

    // Neutral responses
    {
        emotion: 'neutral' as const,
        responseType: 'guidance',
        content: "How are you really feeling today? Sometimes when we feel neutral, it's a good opportunity to check in with ourselves more deeply.",
        copingStrategies: [
            "Practice mindfulness",
            "Take a moment to check in with yourself",
            "Consider what would make you feel better",
            "Engage in activities you enjoy"
        ],
        priority: 1
    }
];

export async function POST(request: NextRequest) {
    try {
        // Check if templates already exist
        const existingTemplates = await db.query.AIResponseTemplateTable.findMany({
            limit: 1
        });

        if (existingTemplates.length > 0) {
            return NextResponse.json({
                success: false,
                message: "AI response templates already exist in the database"
            });
        }

        // Insert all templates
        for (const template of aiResponseTemplates) {
            await db.insert(AIResponseTemplateTable).values(template);
        }

        return NextResponse.json({
            success: true,
            message: `Successfully seeded ${aiResponseTemplates.length} AI response templates`,
            count: aiResponseTemplates.length
        });

    } catch (error) {
        console.error('Error seeding AI response templates:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to seed AI response templates',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const templates = await db.query.AIResponseTemplateTable.findMany({
            orderBy: (templates, { asc }) => [asc(templates.emotion), asc(templates.priority)]
        });

        return NextResponse.json({
            success: true,
            templates,
            count: templates.length
        });

    } catch (error) {
        console.error('Error fetching AI response templates:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to fetch AI response templates',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
} 