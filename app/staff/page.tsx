"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Plus,
  Save,
  ChevronDown,
  ChevronUp,
  MapPin,
  Edit2,
  Eye,
  X,
  AlertCircle,
  Check,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { useApp } from "@/context/AppContext"
import { translations } from "@/lib/translations"
import { mockRoutes, departments } from "@/lib/mockData"
import { RouteStepCard, RouteStepData } from "@/components/staff/RouteStepCard"
import { PreviewMode } from "@/components/staff/PreviewMode"

interface NewRoute {
  name: string
  department: string
  steps: RouteStepData[]
}

export default function StaffPage() {
  const { language, isStaffMode, setIsStaffMode } = useApp()
  const t = translations[language].staff

  const [expandedRoute, setExpandedRoute] = useState<string | null>(null)
  const [isAddingRoute, setIsAddingRoute] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [newRoute, setNewRoute] = useState<NewRoute>({
    name: "",
    department: "",
    steps: [],
  })

  const completedSteps = newRoute.steps.filter((s) => s.instruction && s.image).length
  const totalSteps = newRoute.steps.length
  const progressPercent = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0

  const canSave = newRoute.name && newRoute.department && newRoute.steps.length > 0 && 
    newRoute.steps.every((s) => s.instruction)

  const addStep = useCallback(() => {
    setNewRoute((prev) => ({
      ...prev,
      steps: [
        ...prev.steps,
        {
          id: `step-${Date.now()}`,
          instruction: "",
          direction: "straight",
          image: null,
        },
      ],
    }))
  }, [])

  const removeStep = useCallback((stepId: string) => {
    setNewRoute((prev) => ({
      ...prev,
      steps: prev.steps.filter((s) => s.id !== stepId),
    }))
  }, [])

  const updateStep = useCallback((stepId: string, field: keyof RouteStepData, value: string | null) => {
    setNewRoute((prev) => ({
      ...prev,
      steps: prev.steps.map((s) =>
        s.id === stepId ? { ...s, [field]: value } : s
      ),
    }))
  }, [])

  const moveStepUp = useCallback((stepId: string) => {
    setNewRoute((prev) => {
      const index = prev.steps.findIndex((s) => s.id === stepId)
      if (index <= 0) return prev
      const newSteps = [...prev.steps]
      ;[newSteps[index - 1], newSteps[index]] = [newSteps[index], newSteps[index - 1]]
      return { ...prev, steps: newSteps }
    })
  }, [])

  const moveStepDown = useCallback((stepId: string) => {
    setNewRoute((prev) => {
      const index = prev.steps.findIndex((s) => s.id === stepId)
      if (index >= prev.steps.length - 1) return prev
      const newSteps = [...prev.steps]
      ;[newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]]
      return { ...prev, steps: newSteps }
    })
  }, [])

  const handleSaveRoute = useCallback(() => {
    // In a real app, this would save to a database
    setSaveSuccess(true)
    setShowConfirmModal(false)
    setTimeout(() => {
      setSaveSuccess(false)
      setIsAddingRoute(false)
      setNewRoute({ name: "", department: "", steps: [] })
    }, 2000)
  }, [])

  const handleCancelRoute = useCallback(() => {
    setIsAddingRoute(false)
    setNewRoute({ name: "", department: "", steps: [] })
  }, [])

  // Staff mode gate
  if (!isStaffMode) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-lg mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <MapPin className="w-12 h-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Staff Mode Required
            </h1>
            <p className="text-muted-foreground mb-8 text-lg">
              Please enable Staff Mode to access route management
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsStaffMode(true)}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-semibold text-lg min-h-[56px]"
            >
              Enable Staff Mode
            </motion.button>
          </motion.div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-6 pb-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 min-h-[48px]"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium text-lg">Back to Home</span>
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{t.title}</h1>
              <p className="text-muted-foreground mt-1">
                Create navigation routes in under 1 minute
              </p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-accent text-accent-foreground font-medium text-sm">
              Staff Mode
            </div>
          </div>
        </motion.div>

        {/* Quick Start Card */}
        {!isAddingRoute && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-6 text-primary-foreground">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">Create New Route</h3>
                  <p className="text-primary-foreground/80 mb-4">
                    Add step-by-step navigation with images and voice input
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsAddingRoute(true)}
                    className="px-6 py-3 bg-white text-primary rounded-xl font-semibold flex items-center gap-2 min-h-[52px]"
                  >
                    <Plus className="w-5 h-5" />
                    {t.addRoute}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Add Route Form - Wizard Style */}
        <AnimatePresence>
          {isAddingRoute && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-visible"
            >
              {/* Progress Header */}
              <div className="bg-card rounded-3xl border border-border p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-foreground">
                    New Route
                  </h3>
                  {totalSteps > 0 && (
                    <span className="text-sm font-medium text-muted-foreground">
                      {completedSteps} of {totalSteps} steps complete
                    </span>
                  )}
                </div>
                {totalSteps > 0 && (
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                )}
              </div>

              {/* Route Details Card */}
              <div className="bg-card rounded-3xl border border-border p-6 mb-4">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                  Route Details
                </h4>
                
                {/* Route Name */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t.routeName}
                  </label>
                  <input
                    type="text"
                    value={newRoute.name}
                    onChange={(e) =>
                      setNewRoute((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="e.g., Reception to Radiology"
                    className="w-full px-4 py-4 bg-background rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base"
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t.department}
                  </label>
                  <select
                    value={newRoute.department}
                    onChange={(e) =>
                      setNewRoute((prev) => ({
                        ...prev,
                        department: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-4 bg-background rounded-xl border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base appearance-none cursor-pointer"
                  >
                    <option value="">Select department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Steps Section */}
              <div className="space-y-4 mb-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Navigation Steps
                  </h4>
                  <span className="text-sm text-muted-foreground">
                    {newRoute.steps.length} {newRoute.steps.length === 1 ? "step" : "steps"}
                  </span>
                </div>

                {/* Step Cards */}
                <AnimatePresence>
                  {newRoute.steps.map((step, index) => (
                    <RouteStepCard
                      key={step.id}
                      step={step}
                      index={index}
                      totalSteps={newRoute.steps.length}
                      onUpdate={updateStep}
                      onDelete={removeStep}
                      onMoveUp={moveStepUp}
                      onMoveDown={moveStepDown}
                    />
                  ))}
                </AnimatePresence>

                {/* Empty State */}
                {newRoute.steps.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-muted rounded-3xl py-12 text-center"
                  >
                    <MapPin className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                    <p className="text-muted-foreground text-lg">
                      No steps added yet
                    </p>
                    <p className="text-muted-foreground text-sm mt-1">
                      Click the button below to add your first step
                    </p>
                  </motion.div>
                )}

                {/* Add Step Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={addStep}
                  className="w-full py-4 bg-primary/10 text-primary rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 border-2 border-dashed border-primary/30 hover:bg-primary/15 hover:border-primary/50 transition-colors min-h-[60px]"
                >
                  <Plus className="w-6 h-6" />
                  {t.addStep}
                </motion.button>
              </div>

              {/* Preview Button */}
              {newRoute.steps.length > 0 && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setShowPreview(true)}
                  className="w-full py-4 bg-secondary text-secondary-foreground rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 mb-4 min-h-[60px]"
                >
                  <Eye className="w-6 h-6" />
                  Preview Navigation
                </motion.button>
              )}

              {/* Validation Warnings */}
              {newRoute.steps.some((s) => !s.instruction) && newRoute.steps.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl mb-4"
                >
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <p className="text-amber-800 text-sm">
                    Some steps are missing instructions. Add instructions to all steps before saving.
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Existing Routes */}
        {!isAddingRoute && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {t.routesList}
            </h3>

            <div className="space-y-3">
              {mockRoutes.map((route) => (
                <motion.div
                  key={route.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-2xl border border-border overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedRoute(
                        expandedRoute === route.id ? null : route.id
                      )
                    }
                    className="w-full p-4 flex items-center gap-4 text-left min-h-[72px]"
                  >
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${route.color}20` }}
                    >
                      <MapPin className="w-7 h-7" style={{ color: route.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground text-lg truncate">
                        {route.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {route.steps.length} steps
                      </p>
                    </div>
                    {expandedRoute === route.id ? (
                      <ChevronUp className="w-6 h-6 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-muted-foreground flex-shrink-0" />
                    )}
                  </button>

                  <AnimatePresence>
                    {expandedRoute === route.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 border-t border-border pt-4">
                          <div className="space-y-2 mb-4">
                            {route.steps.map((step, index) => (
                              <div
                                key={step.step}
                                className="flex items-center gap-3 py-2"
                              >
                                <span
                                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                                  style={{ backgroundColor: route.color }}
                                >
                                  {index + 1}
                                </span>
                                <span className="text-foreground">
                                  {step.instruction}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <button className="flex-1 py-3 bg-muted text-foreground rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-muted/80 transition-colors min-h-[52px]">
                              <Edit2 className="w-5 h-5" />
                              Edit
                            </button>
                            <button className="flex-1 py-3 bg-primary/10 text-primary rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-primary/20 transition-colors min-h-[52px]">
                              <Eye className="w-5 h-5" />
                              Preview
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </main>

      {/* Sticky Bottom Action Bar */}
      <AnimatePresence>
        {isAddingRoute && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border"
          >
            <div className="max-w-2xl mx-auto px-4 py-4">
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCancelRoute}
                  className="flex-1 py-4 bg-muted text-foreground rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 min-h-[60px]"
                >
                  <X className="w-6 h-6" />
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: canSave ? 1.02 : 1 }}
                  whileTap={{ scale: canSave ? 0.98 : 1 }}
                  onClick={() => canSave && setShowConfirmModal(true)}
                  disabled={!canSave}
                  className={`flex-1 py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 min-h-[60px] transition-colors ${
                    canSave
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  <Save className="w-6 h-6" />
                  {t.saveRoute}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowConfirmModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-3xl p-6 max-w-md w-full border border-border"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Save className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Save Route?
                </h3>
                <p className="text-muted-foreground">
                  Are you sure you want to save &quot;{newRoute.name}&quot; with {newRoute.steps.length} steps?
                </p>
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-4 bg-muted text-foreground rounded-2xl font-semibold min-h-[56px]"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveRoute}
                  className="flex-1 py-4 bg-primary text-primary-foreground rounded-2xl font-semibold min-h-[56px]"
                >
                  Save Route
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="flex items-center gap-3 px-6 py-4 bg-accent text-accent-foreground rounded-2xl shadow-lg">
              <Check className="w-6 h-6" />
              <span className="font-semibold">Route saved successfully!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Mode */}
      <AnimatePresence>
        {showPreview && newRoute.steps.length > 0 && (
          <PreviewMode
            routeName={newRoute.name || "New Route"}
            steps={newRoute.steps}
            onClose={() => setShowPreview(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
