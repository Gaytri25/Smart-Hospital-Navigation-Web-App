"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Keyboard, MapPin, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { QRScanner } from "@/components/QRScanner"
import { useApp } from "@/context/AppContext"
import { translations } from "@/lib/translations"
import { mockRoutes, departments } from "@/lib/mockData"

export default function ScannerPage() {
  const router = useRouter()
  const { language, setCurrentRoute, isAuthenticated, isRestrictedArea } = useApp()
  const t = translations[language].scanner
  const [showManualEntry, setShowManualEntry] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState("")

  const handleScan = (data: string) => {
    const route = mockRoutes.find((r) => r.id === data)
    if (route) {
      const deptLower = route.department.toLowerCase()
      
      // Check if restricted area and not authenticated
      if (isRestrictedArea(deptLower) && !isAuthenticated) {
        router.push(`/access?department=${deptLower}&returnTo=/navigate/${deptLower}`)
      } else {
        setCurrentRoute(route)
        router.push(`/navigate/${deptLower}`)
      }
    }
  }

  const handleManualSelect = () => {
    if (selectedDepartment) {
      const route = mockRoutes.find(
        (r) => r.department.toLowerCase() === selectedDepartment.toLowerCase()
      )
      
      // Check if restricted area and not authenticated
      if (isRestrictedArea(selectedDepartment) && !isAuthenticated) {
        router.push(`/access?department=${selectedDepartment}&returnTo=/navigate/${selectedDepartment}`)
      } else if (route) {
        setCurrentRoute(route)
        router.push(`/navigate/${selectedDepartment.toLowerCase()}`)
      }
    }
  }

  const isRestricted = (deptId: string) => isRestrictedArea(deptId)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-6">
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

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold text-foreground mb-2">{t.title}</h1>
          <p className="text-muted-foreground">{t.instructions}</p>
        </motion.div>

        {/* QR Scanner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <QRScanner onScan={handleScan} />
        </motion.div>

        {/* Manual Entry Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <button
            onClick={() => setShowManualEntry(!showManualEntry)}
            className="w-full flex items-center justify-center gap-2 py-4 text-primary font-semibold hover:text-primary/80 transition-colors"
          >
            <Keyboard className="w-5 h-5" />
            {t.manualEntry}
          </button>
        </motion.div>

        {/* Manual Entry Form */}
        {showManualEntry && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-card rounded-3xl p-6 border border-border"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Select Department
            </h3>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              {departments.map((dept) => {
                const restricted = isRestricted(dept.id)
                return (
                  <motion.button
                    key={dept.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedDepartment(dept.id)}
                    className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3 relative ${
                      selectedDepartment === dept.id
                        ? "border-primary bg-primary/5"
                        : "border-border bg-background hover:border-primary/50"
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${dept.color}20` }}
                    >
                      <MapPin className="w-5 h-5" style={{ color: dept.color }} />
                    </div>
                    <div className="text-left flex-1">
                      <span className="font-medium text-foreground text-sm block">
                        {dept.name}
                      </span>
                      {restricted && !isAuthenticated && (
                        <span className="text-xs text-amber-500 flex items-center gap-1 mt-0.5">
                          <ShieldCheck className="w-3 h-3" />
                          Requires Access
                        </span>
                      )}
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* Notice for restricted areas */}
            {selectedDepartment && isRestricted(selectedDepartment) && !isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-800 rounded-2xl"
              >
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-700 dark:text-amber-400">
                      Restricted Area
                    </p>
                    <p className="text-sm text-amber-600 dark:text-amber-500">
                      You will need to verify your visitor access before navigating to this area.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleManualSelect}
              disabled={!selectedDepartment}
              className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
                selectedDepartment
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              {selectedDepartment && isRestricted(selectedDepartment) && !isAuthenticated ? (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  Verify Access & Navigate
                </>
              ) : (
                "Start Navigation"
              )}
            </motion.button>
          </motion.div>
        )}
      </main>
    </div>
  )
}
