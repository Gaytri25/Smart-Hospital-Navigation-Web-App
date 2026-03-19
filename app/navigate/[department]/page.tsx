"use client"

import { useState, useEffect, useCallback, use } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  HelpCircle,
  CheckCircle,
  ShieldCheck,
  User,
  MapPin,
} from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { StepCard } from "@/components/StepCard"
import { VoiceButton } from "@/components/VoiceButton"
import { HelpPopup } from "@/components/HelpPopup"
import { AccessTimer } from "@/components/access/AccessTimer"
import { RestrictedAreaAlert } from "@/components/access/RestrictedAreaAlert"
import { useApp } from "@/context/AppContext"
import { translations } from "@/lib/translations"
import { mockRoutes } from "@/lib/mockData"

interface NavigatePageProps {
  params: Promise<{ department: string }>
}

export default function NavigatePage({ params }: NavigatePageProps) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { 
    language, 
    currentRoute, 
    setCurrentRoute, 
    currentStep, 
    setCurrentStep,
    isAuthenticated,
    patientAccess,
    isRestrictedArea,
  } = useApp()
  const t = translations[language].navigation

  const [showHelp, setShowHelp] = useState(false)
  const [showRestrictedAlert, setShowRestrictedAlert] = useState(false)
  const [timeOnStep, setTimeOnStep] = useState(0)
  const [hasArrived, setHasArrived] = useState(false)

  const deptName = resolvedParams.department
  const isRestricted = isRestrictedArea(deptName)

  // Check access for restricted areas
  useEffect(() => {
    if (isRestricted && !isAuthenticated) {
      setShowRestrictedAlert(true)
    }
  }, [isRestricted, isAuthenticated])

  // Find route based on department
  useEffect(() => {
    if (!currentRoute) {
      const route = mockRoutes.find(
        (r) => r.department.toLowerCase() === deptName.toLowerCase()
      )
      if (route) {
        setCurrentRoute(route)
        setCurrentStep(0)
      }
    }
  }, [deptName, currentRoute, setCurrentRoute, setCurrentStep])

  // Smart help - detect if user stays too long on a step
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOnStep((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [currentStep])

  // Show help popup if user stays on step for more than 30 seconds
  useEffect(() => {
    if (timeOnStep >= 30 && !hasArrived) {
      setShowHelp(true)
    }
  }, [timeOnStep, hasArrived])

  // Reset timer when step changes
  useEffect(() => {
    setTimeOnStep(0)
  }, [currentStep])

  const handleNextStep = useCallback(() => {
    if (currentRoute && currentStep < currentRoute.steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else if (currentRoute && currentStep === currentRoute.steps.length - 1) {
      setHasArrived(true)
    }
  }, [currentRoute, currentStep, setCurrentStep])

  const handlePrevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setHasArrived(false)
    }
  }, [currentStep, setCurrentStep])

  const handleRestart = useCallback(() => {
    setCurrentStep(0)
    setHasArrived(false)
    setShowHelp(false)
  }, [setCurrentStep])

  const handleCallStaff = () => {
    alert("Staff has been notified. Someone will assist you shortly.")
    setShowHelp(false)
  }

  const handleShowLastStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
    setShowHelp(false)
  }

  const handleRestrictedClose = () => {
    setShowRestrictedAlert(false)
    router.push("/")
  }

  if (!currentRoute) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 py-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading route...</p>
          </div>
        </main>
      </div>
    )
  }

  const currentStepData = currentRoute.steps[currentStep]
  const progress = ((currentStep + 1) / currentRoute.steps.length) * 100

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-6 pb-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-4"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Exit</span>
          </Link>

          <div className="flex items-center gap-2">
            {/* Access Timer for restricted areas */}
            {isRestricted && isAuthenticated && (
              <AccessTimer compact />
            )}
            
            <div
              className="px-4 py-2 rounded-xl font-semibold text-sm"
              style={{
                backgroundColor: `${currentRoute.color}20`,
                color: currentRoute.color,
              }}
            >
              {currentRoute.department}
            </div>
          </div>
        </motion.div>

        {/* Patient Info Banner (for restricted areas) */}
        {isRestricted && isAuthenticated && patientAccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 bg-accent/5 border-2 border-accent/20 rounded-2xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-xl">
                <ShieldCheck className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Visiting</p>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-foreground flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {patientAccess.patientName}
                  </span>
                  <span className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {patientAccess.patientRoom}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          className="h-2 bg-muted rounded-full mb-6 overflow-hidden"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className="h-full rounded-full"
            style={{ backgroundColor: currentRoute.color }}
          />
        </motion.div>

        {/* Step Counter */}
        <div className="text-center mb-6">
          <span className="text-muted-foreground">
            {t.step} {currentStep + 1} {t.of} {currentRoute.steps.length}
          </span>
        </div>

        {/* Arrived State */}
        <AnimatePresence mode="wait">
          {hasArrived ? (
            <motion.div
              key="arrived"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: currentRoute.color }}
              >
                <CheckCircle className="w-12 h-12 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {t.arrived}
              </h2>
              <p className="text-muted-foreground mb-4">
                You have reached {currentRoute.department}
              </p>
              
              {/* Show patient room info if visiting */}
              {isRestricted && isAuthenticated && patientAccess && (
                <div className="bg-accent/5 border-2 border-accent/20 rounded-2xl p-4 mb-6 inline-block">
                  <p className="text-foreground">
                    Patient Room: <span className="font-bold">{patientAccess.patientRoom}</span>
                  </p>
                </div>
              )}
              
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRestart}
                  className="flex-1 py-4 px-6 bg-muted text-foreground rounded-2xl font-semibold flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  {t.restart}
                </motion.button>
                <Link href="/" className="flex-1">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 px-6 bg-primary text-primary-foreground rounded-2xl font-semibold"
                  >
                    Done
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`step-${currentStep}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Current Step Card */}
              <StepCard
                step={currentStepData}
                isActive={true}
                isCompleted={false}
                color={currentRoute.color}
                totalSteps={currentRoute.steps.length}
              />

              {/* Voice Button */}
              <div className="mt-6">
                <VoiceButton
                  text={currentStepData.instruction}
                  size="lg"
                  className="w-full"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Controls */}
        {!hasArrived && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border p-4"
          >
            <div className="max-w-2xl mx-auto flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrevStep}
                disabled={currentStep === 0}
                className={`p-4 rounded-2xl transition-all ${
                  currentStep === 0
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNextStep}
                className="flex-1 py-4 bg-primary text-primary-foreground rounded-2xl font-semibold text-lg flex items-center justify-center gap-2"
              >
                {currentStep === currentRoute.steps.length - 1 ? (
                  "Complete"
                ) : (
                  <>
                    {t.nextStep}
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowHelp(true)}
                className="p-4 rounded-2xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all"
              >
                <HelpCircle className="w-6 h-6" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </main>

      {/* Help Popup */}
      <HelpPopup
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        onCallStaff={handleCallStaff}
        onRestart={handleRestart}
        onShowLastStep={handleShowLastStep}
      />

      {/* Restricted Area Alert */}
      <RestrictedAreaAlert
        isOpen={showRestrictedAlert}
        department={deptName}
        onClose={handleRestrictedClose}
      />
    </div>
  )
}
