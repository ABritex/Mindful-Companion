"use client"

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import type { PreAssessmentResults } from '@/components/ui/pre-assessment-modal'

export function usePreAssessment() {
    const [showModal, setShowModal] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [hasCompletedAssessment, setHasCompletedAssessment] = useState<boolean | null>(null)

    // Check if user has completed pre-assessment
    const checkAssessmentStatus = async () => {
        try {
            const response = await fetch('/api/pre-assessment')
            const data = await response.json()

            if (data.success) {
                setHasCompletedAssessment(data.hasCompletedPreAssessment)
                return data.hasCompletedPreAssessment
            }
        } catch (error) {
            console.error('Error checking assessment status:', error)
        }
        return false
    }

    // Complete pre-assessment
    const completeAssessment = async (results: PreAssessmentResults) => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/pre-assessment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(results),
            })

            const data = await response.json()

            if (data.success) {
                setHasCompletedAssessment(true)
                setShowModal(false)
                toast.success('Pre-assessment completed! Your experience is now personalized.')
                return true
            } else {
                toast.error(data.error || 'Failed to complete assessment')
                return false
            }
        } catch (error) {
            console.error('Error completing assessment:', error)
            toast.error('Failed to complete assessment. Please try again.')
            return false
        } finally {
            setIsLoading(false)
        }
    }

    // Show modal if user hasn't completed assessment
    const showAssessmentModal = async () => {
        const completed = await checkAssessmentStatus()
        if (!completed) {
            setShowModal(true)
        }
    }

    // Close modal
    const closeModal = () => {
        setShowModal(false)
    }

    return {
        showModal,
        isLoading,
        hasCompletedAssessment,
        showAssessmentModal,
        closeModal,
        completeAssessment,
        checkAssessmentStatus
    }
} 