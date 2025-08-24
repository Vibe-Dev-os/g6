"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Edit, Trash2, Eye, EyeOff } from "lucide-react"
import type { Movie } from "@/types/movie"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

interface MovieCardProps {
  movie: Movie
  onEdit: (movie: Movie) => void
  onDelete: (id: number) => void
  onToggleStatus: (id: number, status: "watched" | "unwatched") => void
  onClick?: (movie: Movie) => void // Added onClick prop for card click
  index?: number
}

export function MovieCard({ movie, onEdit, onDelete, onToggleStatus, onClick, index = 0 }: MovieCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleStatus = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsLoading(true)
    try {
      const newStatus = movie.status === "watched" ? "unwatched" : "watched"
      await onToggleStatus(movie.id, newStatus)
    } catch (error) {
      console.error("Error toggling status:", error)
      toast.error("Failed to update movie status")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCardClick = () => {
    if (onClick) {
      onClick(movie)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.3,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        className="group hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer"
        onClick={handleCardClick}
      >
        <CardHeader className="pb-3 p-4 md:p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <motion.h3
                className="font-semibold text-lg leading-tight mb-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                {movie.title}
              </motion.h3>
              <motion.p
                className="text-muted-foreground text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                {movie.year}
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 + 0.4 }}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity min-h-[44px] min-w-[44px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[140px]">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onEdit(movie)
                    }}
                    className="py-3 px-4"
                  >
                    <Edit className="h-4 w-4 mr-3" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(movie.id)
                    }}
                    className="text-destructive py-3 px-4"
                  >
                    <Trash2 className="h-4 w-4 mr-3" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 p-4 md:p-6 md:pt-0">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.5 }}
            >
              <Badge
                variant={movie.status === "watched" ? "default" : "secondary"}
                className={cn(
                  "transition-colors px-3 py-1 text-sm",
                  movie.status === "watched" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                {movie.status === "watched" ? "Watched" : "Unwatched"}
              </Badge>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.6 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggleStatus}
                disabled={isLoading}
                className="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors min-h-[44px] min-w-[44px]"
              >
                <motion.div
                  animate={{ rotate: isLoading ? 360 : 0 }}
                  transition={{ duration: 1, repeat: isLoading ? Number.POSITIVE_INFINITY : 0 }}
                >
                  {movie.status === "watched" ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </motion.div>
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
