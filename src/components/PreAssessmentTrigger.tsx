"use client"

import { Button } from "@/components/ui/button"
import { usePreAssessment } from "@/lib/hooks/usePreAssessment"
import { Brain } from "lucide-react"

export function PreAssessmentTrigger() {
    const { showAssessmentModal } = usePreAssessment()

    return (
        <Button
            onClick={showAssessmentModal}
            variant="outline"
            className="flex items-center gap-2"
        >
            <Brain className="h-4 w-4" />
            Take Pre-Assessment
        </Button>
    )
} 