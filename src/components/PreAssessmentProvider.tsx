"use client"

import { useEffect } from 'react'
import { PreAssessmentModal } from '@/components/ui/pre-assessment-modal'
import { usePreAssessment } from '@/lib/hooks/usePreAssessment'
import { useCurrentUser } from '@/services/auth/lib/useCurrentUser'

interface PreAssessmentProviderProps {
    children: React.ReactNode
}

export function PreAssessmentProvider({ children }: PreAssessmentProviderProps) {
    const { user } = useCurrentUser()
    const {
        showModal,
        isLoading,
        showAssessmentModal,
        closeModal,
        completeAssessment
    } = usePreAssessment()

    // Show assessment modal when user is logged in and hasn't completed assessment
    useEffect(() => {
        if (user && !isLoading) {
            // Add a small delay to ensure the page has loaded
            const timer = setTimeout(() => {
                showAssessmentModal()
            }, 1000)

            return () => clearTimeout(timer)
        }
    }, [user, isLoading, showAssessmentModal])

    return (
        <>
            {children}
            <PreAssessmentModal
                isOpen={showModal}
                onClose={closeModal}
                onComplete={completeAssessment}
            />
        </>
    )
} 