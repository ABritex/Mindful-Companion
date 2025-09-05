import { NextRequest, NextResponse } from 'next/server';
import { aiResponseGenerator } from '@/lib/ai-response-generator';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { message, emotion } = body;

        if (!message) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        // Generate AI response using training data
        const response = await aiResponseGenerator.generateResponse(
            message,
            emotion || 'neutral',
            { emotion: emotion || 'neutral' }
        );

        // Get coping strategies
        const copingStrategies = aiResponseGenerator.getCopingStrategies(
            emotion || 'neutral',
            'general'
        );

        return NextResponse.json({
            success: true,
            response: response.content,
            strategy: response.strategy,
            empathy: response.empathy,
            relevance: response.relevance,
            copingStrategies,
            detectedEmotion: emotion || 'neutral'
        });

    } catch (error) {
        console.error('Error generating AI response:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to generate response',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        // Test the AI response generator initialization
        await aiResponseGenerator.initialize();

        return NextResponse.json({
            success: true,
            message: 'AI Response Generator initialized successfully',
            status: 'ready'
        });

    } catch (error) {
        console.error('Error initializing AI response generator:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to initialize AI response generator',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
} 