"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle,
  MapPin,
  Clock,
  User,
} from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { PatientAccessForm } from "@/components/access/PatientAccessForm"
import { AccessTimer } from "@/components/access/AccessTimer"
import { useApp } from "@/context/AppContext"
import Confetti from "react-confetti"

export default function AccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const targetDepartment = searchParams.get("department")
  const returnTo = searchParams.get("returnTo")
  
  const { isAuthenticated, patientAccess, revokeAccess } = useApp()
  const [showSuccess, setShowSuccess] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight })
  }, [])

  const handleSuccess = () => {
    setShowSuccess(true)
  }

  const handleContinue = () => {
    if (returnTo) {
      router.push(returnTo)
    } else if (targetDepartment) {
      router.push(`/navigate/${targetDepartment}`)
    } else {
      router.push("/")
    }
  }

  // If already authenticated, show status
  if (isAuthenticated && patientAccess && !showSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-lg mx-auto px-4 py-6">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
          </motion.div>

          {/* Access Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-3xl border border-border p-6 shadow-lg"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-accent" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                Access Active
              </h1>
              <p className="text-muted-foreground mt-1">
                You have verified visitor access
              </p>
            </div>

            {/* Patient Info */}
            <div className="bg-muted rounded-2xl p-4 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <User className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Patient</p>
                  <p className="font-semibold text-foreground">
                    {patientAccess.patientName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Room</p>
                  <p className="font-semibold text-foreground">
                    {patientAccess.patientRoom}
                  </p>
                </div>
              </div>
            </div>

            {/* Timer */}
            <AccessTimer />

            {/* Actions */}
            <div className="space-y-3 mt-6">
              <Link href={`/navigate/${patientAccess.patientRoom.split("-")[0].toLowerCase()}`}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-semibold text-lg flex items-center justify-center gap-2"
                >
                  <MapPin className="w-5 h-5" />
                  Navigate to Room
                </motion.button>
              </Link>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={revokeAccess}
                className="w-full py-4 bg-muted text-foreground rounded-2xl font-semibold text-lg"
              >
                End Visit
              </motion.button>
            </div>
          </motion.div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Confetti on Success */}
      {showSuccess && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </Link>
        </motion.div>

        <AnimatePresence mode="wait">
          {showSuccess ? (
            /* Success State */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-24 h-24 mx-auto mb-6 rounded-full bg-accent flex items-center justify-center"
              >
                <CheckCircle className="w-12 h-12 text-white" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-foreground mb-2"
              >
                Access Granted!
              </motion.h1>

              {patientAccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-accent/5 border-2 border-accent/20 rounded-2xl p-6 mb-6 text-left"
                >
                  <p className="text-lg text-foreground mb-4">
                    Welcome! You are authorized to visit:
                  </p>
                  <div className="flex items-center gap-3 mb-3">
                    <User className="w-5 h-5 text-accent" />
                    <span className="font-semibold text-foreground">
                      {patientAccess.patientName}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <MapPin className="w-5 h-5 text-accent" />
                    <span className="font-semibold text-foreground">
                      {patientAccess.patientRoom}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-accent" />
                    <span className="text-muted-foreground">
                      Access valid for 2 hours
                    </span>
                  </div>
                </motion.div>
              )}

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleContinue}
                className="w-full py-5 bg-primary text-primary-foreground rounded-2xl font-semibold text-xl flex items-center justify-center gap-2"
              >
                <MapPin className="w-6 h-6" />
                Start Navigation
              </motion.button>
            </motion.div>
          ) : (
            /* Form State */
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center"
                >
                  <ShieldCheck className="w-8 h-8 text-primary" />
                </motion.div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Patient Access Verification
                </h1>
                <p className="text-muted-foreground">
                  Please verify your identity to access patient areas
                </p>
                {targetDepartment && (
                  <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                    <MapPin className="w-4 h-4" />
                    Destination: {targetDepartment.toUpperCase()}
                  </div>
                )}
              </div>

              {/* Form Card */}
              <div className="bg-card rounded-3xl border border-border p-6 shadow-lg">
                <PatientAccessForm
                  onSuccess={handleSuccess}
                  targetDepartment={targetDepartment || undefined}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
