"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function NavBar({ items, className }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div
      className={cn(
        "fixed top-0 left-1/2 -translate-x-1/2 z-50 pt-6",
        className,
      )}
    >
      <div className="flex items-center gap-3 bg-black/40 border border-primary/30 backdrop-blur-xl py-1 px-1 rounded-full shadow-lg shadow-primary/10">
        {items.map((item) => {
          const isActive = activeTab === item.name
          return (
            <Link
              key={item.name}
              href={item.url}
              onClick={() => setActiveTab(item.name)}
              className={cn(
                "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-all duration-300",
                "text-white/70 hover:text-primary",
                isActive && "text-primary",
              )}
            >
              <span className="relative z-10">{item.name}</span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-primary/10 rounded-full -z-10 border border-primary/20"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  {/* Tubelight glow effect */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-primary rounded-t-full shadow-lg shadow-primary/50">
                    {/* Outer glow */}
                    <div className="absolute w-16 h-8 bg-primary/30 rounded-full blur-xl -top-3 -left-2 animate-pulse" />
                    {/* Middle glow */}
                    <div className="absolute w-12 h-6 bg-primary/40 rounded-full blur-lg -top-2 animate-pulse" style={{ animationDelay: '0.2s' }} />
                    {/* Inner glow */}
                    <div className="absolute w-8 h-4 bg-primary/50 rounded-full blur-md -top-1 left-2 animate-pulse" style={{ animationDelay: '0.4s' }} />
                    {/* Core light */}
                    <div className="absolute w-full h-full bg-gradient-to-b from-primary to-primary/50 rounded-t-full" />
                  </div>
                  {/* Bottom reflection */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-primary/20 rounded-full blur-sm" />
                </motion.div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
