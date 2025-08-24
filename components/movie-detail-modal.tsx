"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Edit, Trash2, Eye, EyeOff } from "lucide-react"
import type { Movie } from "@/types/movie"
import { cn } from "@/lib/utils"

interface MovieDetailModalProps {
  movie: Movie | null
  isOpen: boolean
  onClose: () => void
  onEdit: (movie: Movie) => void
  onDelete: (id: number) => void
  onToggleStatus: (id: number, status: "watched" | "unwatched") => void
  isLoading?: boolean
}

export function MovieDetailModal({
  movie,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onToggleStatus,
  isLoading = false,
}: MovieDetailModalProps) {
  if (!movie) return null

  const handleToggleStatus = () => {
    const newStatus = movie.status === "watched" ? "unwatched" : "watched"
    onToggleStatus(movie.id, newStatus)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">{movie.title}</DialogTitle>
            </DialogHeader>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Movie Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{movie.year}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Badge
                    variant={movie.status === "watched" ? "default" : "secondary"}
                    className={cn(
                      "transition-colors",
                      movie.status === "watched"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {movie.status === "watched" ? "Watched" : "Unwatched"}
                  </Badge>
                </div>

                {movie.created_at && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Added {new Date(movie.created_at).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-2">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleToggleStatus}
                    disabled={isLoading}
                    className="w-full bg-background border-border text-foreground hover:bg-muted hover:text-foreground transition-colors"
                    variant="outline"
                  >
                    {movie.status === "watched" ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Mark as Unwatched
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Mark as Watched
                      </>
                    )}
                  </Button>
                </motion.div>

                <div className="flex space-x-2">
                  <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button onClick={() => onEdit(movie)} variant="outline" className="w-full bg-background border-border text-foreground hover:bg-muted hover:text-foreground transition-colors">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </motion.div>

                  <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button onClick={() => onDelete(movie.id)} variant="destructive" className="w-full">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
