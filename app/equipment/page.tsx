"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Search, Filter, Accessibility, Wind, BedDouble } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { EquipmentCard } from "@/components/EquipmentCard"
import { useApp } from "@/context/AppContext"
import { translations } from "@/lib/translations"
import { equipment } from "@/lib/mockData"

const equipmentTypes = [
  { id: "all", label: "All", icon: Filter },
  { id: "Wheelchair", label: "Wheelchair", icon: Accessibility },
  { id: "Oxygen Cylinder", label: "Oxygen", icon: Wind },
  { id: "Stretcher", label: "Stretcher", icon: BedDouble },
]

export default function EquipmentPage() {
  const { language } = useApp()
  const t = translations[language].equipment
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)

  const filteredEquipment = useMemo(() => {
    return equipment.filter((item) => {
      const matchesSearch = item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = selectedType === "all" || item.type === selectedType
      const matchesAvailability = !showAvailableOnly || item.available
      return matchesSearch && matchesType && matchesAvailability
    })
  }, [searchQuery, selectedType, showAvailableOnly])

  const availableCount = equipment.filter((e) => e.available).length

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </Link>

          <h1 className="text-2xl font-bold text-foreground">{t.title}</h1>
          <p className="text-muted-foreground mt-1">
            {availableCount} items available nearby
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-card rounded-2xl border border-border text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </motion.div>

        {/* Type Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6"
        >
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            {equipmentTypes.map((type) => {
              const Icon = type.icon
              return (
                <motion.button
                  key={type.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedType(type.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap font-medium transition-all min-h-[44px] ${
                    selectedType === type.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-muted-foreground border border-border hover:border-primary/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {type.label}
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Available Only Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <button
            onClick={() => setShowAvailableOnly(!showAvailableOnly)}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all w-full ${
              showAvailableOnly
                ? "bg-accent/10 border-2 border-accent"
                : "bg-card border border-border"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${
                showAvailableOnly ? "bg-accent" : "bg-muted"
              }`}
            >
              {showAvailableOnly && (
                <motion.svg
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </motion.svg>
              )}
            </div>
            <span className="font-medium text-foreground">
              Show available only
            </span>
          </button>
        </motion.div>

        {/* Equipment List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="space-y-4"
        >
          {filteredEquipment.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No equipment found matching your criteria
              </p>
            </div>
          ) : (
            filteredEquipment.map((item, index) => (
              <EquipmentCard
                key={item.id}
                id={item.id}
                type={item.type}
                available={item.available}
                location={item.location}
                floor={item.floor}
                index={index}
              />
            ))
          )}
        </motion.div>
      </main>
    </div>
  )
}
