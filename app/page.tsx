"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ScanLine,
  Search,
  HelpCircle,
  Accessibility,
  Stethoscope,
  HeartPulse,
  ScanSearch,
  Siren,
  Pill,
  FlaskConical,
  ChevronRight,
  MapPin,
  ShieldCheck,
  User,
  Clock,
} from "lucide-react"
import { Navbar } from "@/components/Navbar"
import { AccessibilityPanel } from "@/components/AccessibilityPanel"
import { AccessTimer } from "@/components/access/AccessTimer"
import { useApp } from "@/context/AppContext"
import { translations } from "@/lib/translations"

const quickAccessItems = [
  { id: "radiology", icon: ScanSearch, color: "#2563EB" },
  { id: "icu", icon: HeartPulse, color: "#EF4444" },
  { id: "opd", icon: Stethoscope, color: "#10B981" },
  { id: "emergency", icon: Siren, color: "#EF4444" },
  { id: "pharmacy", icon: Pill, color: "#8b5cf6" },
  { id: "laboratory", icon: FlaskConical, color: "#f59e0b" },
]

const RESTRICTED_AREAS = ["icu", "operation theatre", "ot", "nicu", "ccu"]

export default function HomePage() {
  const { language, isHighContrast, isAuthenticated, patientAccess } = useApp()
  const t = translations[language].home
  const [searchQuery, setSearchQuery] = useState("")
  const [accessibilityOpen, setAccessibilityOpen] = useState(false)
  
  const isRestrictedArea = (department: string) => {
    return RESTRICTED_AREAS.includes(department.toLowerCase())
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className={`min-h-screen bg-background ${isHighContrast ? "high-contrast" : ""}`}>
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-6 pb-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants} className="text-center py-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
              <MapPin className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2 text-balance">
              {t.title}
            </h1>
            <p className="text-lg text-muted-foreground">{t.subtitle}</p>
          </motion.div>

          {/* Active Access Banner */}
          {isAuthenticated && patientAccess && (
            <motion.div variants={itemVariants}>
              <Link href="/access">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-accent/10 border-2 border-accent/30 rounded-3xl p-5 cursor-pointer"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-accent font-semibold">Active Access</p>
                      <p className="text-foreground font-bold">{patientAccess.patientName}</p>
                    </div>
                    <AccessTimer compact />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {patientAccess.relation}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {patientAccess.patientRoom}
                    </span>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          )}

          {/* Primary CTA - Scan QR */}
          <motion.div variants={itemVariants}>
            <Link href="/scanner">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative overflow-hidden bg-primary rounded-3xl p-6 flex items-center gap-5 cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
                  <ScanLine className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-primary-foreground mb-1">
                    {t.scanQR}
                  </h2>
                  <p className="text-primary-foreground/80 text-sm">
                    Point your camera at any hospital QR code
                  </p>
                </div>
                <ChevronRight className="w-6 h-6 text-primary-foreground/80" />
              </motion.div>
            </Link>
          </motion.div>

          {/* Search */}
          <motion.div variants={itemVariants}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
              <input
                type="text"
                placeholder={t.searchDepartment}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-4 py-4 bg-card rounded-2xl border border-border text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </motion.div>

          {/* Quick Access */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {t.quickAccess}
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {quickAccessItems.map((item, index) => {
                const Icon = item.icon
                const label = t[item.id as keyof typeof t] as string
                const restricted = isRestrictedArea(item.id)
                const needsAccess = restricted && !isAuthenticated
                const href = needsAccess 
                  ? `/access?department=${item.id}&returnTo=/navigate/${item.id}`
                  : `/navigate/${item.id}`
                
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={href}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-card rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm hover:shadow-md transition-all border border-border cursor-pointer min-h-[100px] relative"
                      >
                        {needsAccess && (
                          <div className="absolute top-2 right-2">
                            <ShieldCheck className="w-4 h-4 text-amber-500" />
                          </div>
                        )}
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${item.color}15` }}
                        >
                          <Icon
                            className="w-6 h-6"
                            style={{ color: item.color }}
                          />
                        </div>
                        <span className="text-sm font-medium text-foreground text-center">
                          {label}
                        </span>
                      </motion.div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Help & Accessibility */}
          <motion.div variants={itemVariants} className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-accent text-accent-foreground rounded-2xl p-4 flex items-center justify-center gap-3 font-semibold text-lg shadow-sm hover:shadow-md transition-all min-h-[60px]"
            >
              <HelpCircle className="w-6 h-6" />
              {t.needHelp}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setAccessibilityOpen(true)}
              className="bg-card border border-border rounded-2xl p-4 flex items-center justify-center shadow-sm hover:shadow-md transition-all min-h-[60px] min-w-[60px]"
              aria-label="Accessibility options"
            >
              <Accessibility className="w-6 h-6 text-foreground" />
            </motion.button>
          </motion.div>

          {/* Info Card */}
          <motion.div
            variants={itemVariants}
            className="bg-card rounded-2xl p-5 border border-border"
          >
            <h3 className="font-semibold text-foreground mb-2">
              How it works
            </h3>
            <ol className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                  1
                </span>
                <span>Scan QR code at any location in the hospital</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                  2
                </span>
                <span>Select your destination from the list</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                  3
                </span>
                <span>Follow step-by-step directions with voice guidance</span>
              </li>
            </ol>
          </motion.div>
        </motion.div>
      </main>

      <AccessibilityPanel
        isOpen={accessibilityOpen}
        onClose={() => setAccessibilityOpen(false)}
      />
    </div>
  )
}
