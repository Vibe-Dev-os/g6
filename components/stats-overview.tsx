"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Film } from "lucide-react"
import type { Movie } from "@/types/movie"

interface StatsOverviewProps {
  movies: Movie[]
  onFilterChange: (filter: "all" | "watched" | "unwatched") => void
  currentFilter: "all" | "watched" | "unwatched"
}

export function StatsOverview({ movies, onFilterChange, currentFilter }: StatsOverviewProps) {
  const totalMovies = movies.length
  const watchedMovies = movies.filter((movie) => movie.status === "watched").length
  const unwatchedMovies = movies.filter((movie) => movie.status === "unwatched").length

  const stats = [
    {
      title: "Total Movies",
      value: totalMovies,
      icon: Film,
      color: "text-primary",
      filter: "all" as const,
    },
    {
      title: "Watched",
      value: watchedMovies,
      icon: Eye,
      color: "text-green-600",
      filter: "watched" as const,
    },
    {
      title: "Unwatched",
      value: unwatchedMovies,
      icon: EyeOff,
      color: "text-orange-600",
      filter: "unwatched" as const,
    },
  ]

  if (totalMovies === 0) return null

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      {stats.map((stat, index) => {
        const Icon = stat.icon
        const isActive = currentFilter === stat.filter
        
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                isActive ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
              }`}
              onClick={() => onFilterChange(stat.filter)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium ${isActive ? 'text-primary' : ''}`}>
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${isActive ? 'text-primary' : stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${isActive ? 'text-primary' : ''}`}>
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
