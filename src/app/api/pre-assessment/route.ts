import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/drizzle/db"
import { UserTable, PreAssessmentTable } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { getCurrentUser } from "@/services/auth/functions/currentUser"
import { analyzePreAssessment } from "@/lib/claude-sonnet"
import { z } from "zod"

const preAssessmentSchema = z.object({
    // Work and Daily Functioning - using coerce to convert strings to numbers
    workOverwhelmed: z.coerce.number().min(0).max(3),
    concentrationDifficulty: z.coerce.number().min(0).max(3),
    procrastination: z.coerce.number().min(0).max(3),
    irritability: z.coerce.number().min(0).max(3),
    lackAccomplishment: z.coerce.number().min(0).max(3),
    troubleSwitchingOff: z.coerce.number().min(0).max(3),

    // Mood and Emotions
    feelingDown: z.coerce.number().min(0).max(3),
    losingInterest: z.coerce.number().min(0).max(3),
    feelingAnxious: z.coerce.number().min(0).max(3),
    moodSwings: z.coerce.number().min(0).max(3),
    feelingGuilty: z.coerce.number().min(0).max(3),

    // Physical and Behavioral Changes
    sleepProblems: z.coerce.number().min(0).max(3),
    appetiteChanges: z.coerce.number().min(0).max(3),
    feelingTired: z.coerce.number().min(0).max(3),
    physicalSymptoms: z.coerce.number().min(0).max(3),
    substanceUse: z.coerce.number().min(0).max(3),
    withdrawing: z.coerce.number().min(0).max(3),

    // Thoughts and Safety
    thoughtsOfHarm: z.coerce.number().min(0).max(3),
    lifeNotWorthLiving: z.coerce.number().min(0).max(3),
    worriedAboutStudents: z.coerce.number().min(0).max(3),

    // Additional sections
    copingMechanisms: z.array(z.string()),
    goals: z.array(z.string()),
})

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser({ withFullUser: true })
        if (!user) {
            return NextResponse.json({ success: false, error: "User not authenticated" }, { status: 401 })
        }

        const body = await request.json()
        const validatedData = preAssessmentSchema.parse(body)

        // Calculate total score
        const scoreFields = [
            "workOverwhelmed",
            "concentrationDifficulty",
            "procrastination",
            "irritability",
            "lackAccomplishment",
            "troubleSwitchingOff",
            "feelingDown",
            "losingInterest",
            "feelingAnxious",
            "moodSwings",
            "feelingGuilty",
            "sleepProblems",
            "appetiteChanges",
            "feelingTired",
            "physicalSymptoms",
            "substanceUse",
            "withdrawing",
            "thoughtsOfHarm",
            "lifeNotWorthLiving",
            "worriedAboutStudents",
        ]

        const totalScore = scoreFields.reduce((sum, field) => {
            return sum + (validatedData[field as keyof typeof validatedData] as number)
        }, 0)

        console.log("[v0] Starting Claude Sonnet analysis for user:", user.id)
        const aiAnalysis = await analyzePreAssessment(validatedData)
        console.log("[v0] Claude analysis completed, risk level:", aiAnalysis.riskLevel)

        // Check if user already has a pre-assessment
        const existingAssessment = await db.query.PreAssessmentTable.findFirst({
            where: eq(PreAssessmentTable.userId, user.id),
        })

        if (existingAssessment) {
            // Update existing assessment
            await db
                .update(PreAssessmentTable)
                .set({
                    ...validatedData,
                    totalScore,
                    riskLevel: aiAnalysis.riskLevel,
                    aiAnalysis: aiAnalysis,
                    personalizedPlan: aiAnalysis.personalizedPlan,
                    updatedAt: new Date(),
                })
                .where(eq(PreAssessmentTable.userId, user.id))
        } else {
            // Create new assessment
            await db.insert(PreAssessmentTable).values({
                userId: user.id,
                ...validatedData,
                totalScore,
                riskLevel: aiAnalysis.riskLevel,
                aiAnalysis: aiAnalysis,
                personalizedPlan: aiAnalysis.personalizedPlan,
            })
        }

        // Update user's pre-assessment completion status
        await db
            .update(UserTable)
            .set({
                hasCompletedPreAssessment: "true",
                updatedAt: new Date(),
            })
            .where(eq(UserTable.id, user.id))

        console.log("[v0] Pre-assessment saved successfully for user:", user.id)

        return NextResponse.json({
            success: true,
            message: "Pre-assessment completed and analyzed successfully",
            analysis: {
                riskLevel: aiAnalysis.riskLevel,
                primaryConcerns: aiAnalysis.primaryConcerns,
                recommendations: aiAnalysis.recommendations,
                personalizedPlan: aiAnalysis.personalizedPlan,
            },
        })
    } catch (error) {
        console.error("[v0] Error completing pre-assessment:", error)
        return NextResponse.json(
            {
                success: false,
                error: "Failed to complete pre-assessment",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        )
    }
}

export async function GET() {
    try {
        const user = await getCurrentUser({ withFullUser: true })
        if (!user) {
            return NextResponse.json({ success: false, error: "User not authenticated" }, { status: 401 })
        }

        // Get user's pre-assessment data and status
        const userData = await db.query.UserTable.findFirst({
            columns: {
                hasCompletedPreAssessment: true,
            },
            where: eq(UserTable.id, user.id),
        })

        const assessmentData = await db.query.PreAssessmentTable.findFirst({
            where: eq(PreAssessmentTable.userId, user.id),
        })

        return NextResponse.json({
            success: true,
            hasCompletedPreAssessment: userData?.hasCompletedPreAssessment === "true",
            assessmentData: assessmentData || null,
        })
    } catch (error) {
        console.error("[v0] Error fetching pre-assessment status:", error)
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch pre-assessment status",
            },
            { status: 500 },
        )
    }
}