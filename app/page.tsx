"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MovieCard } from "@/components/movie-card"
import { SearchFilter } from "@/components/search-filter"
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal"
import { MovieDetailModal } from "@/components/movie-detail-modal"
import { StatsOverview } from "@/components/stats-overview"
import { InstallPrompt } from "@/components/install-prompt"
import { DownloadButton } from "@/components/download-button"
import { Navbar } from "@/components/navbar"
import type { Movie } from "@/types/movie"
import toast from "react-hot-toast"
import { Loader2, Film, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()
  const [movies, setMovies] = useState<Movie[]>([])
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "watched" | "unwatched">("all")
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; movie: Movie | null }>({
    isOpen: false,
    movie: null,
  })
  const [detailModal, setDetailModal] = useState<{ isOpen: boolean; movie: Movie | null }>({
    isOpen: false,
    movie: null,
  })
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  // Fetch movies
  const fetchMovies = async () => {
    try {
      const response = await fetch("/api/movies")
      if (!response.ok) throw new Error("Failed to fetch movies")
      const data = await response.json()
      setMovies(data)
      setFilteredMovies(data)
    } catch (error) {
      console.error("Error fetching movies:", error)
      toast.error("Failed to load movies")
    } finally {
      setIsLoading(false)
    }
  }

  // Filter movies based on search and status
  useEffect(() => {
    let filtered = movies

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (movie) =>
          movie.title.toLowerCase().includes(searchQuery.toLowerCase()) || movie.year.toString().includes(searchQuery),
      )
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((movie) => movie.status === filterStatus)
    }

    setFilteredMovies(filtered)
  }, [movies, searchQuery, filterStatus])

  // Toggle movie status
  const handleToggleStatus = async (id: number, status: "watched" | "unwatched") => {
    setIsUpdating(true)
    try {
      const movie = movies.find((m) => m.id === id)
      if (!movie) throw new Error("Movie not found")

      const response = await fetch(`/api/movies/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...movie, status }),
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Failed to update movie")

      setMovies((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)))
      toast.success(`Movie marked as ${status}`)

      if (detailModal.movie?.id === id) {
        setDetailModal((prev) => (prev.movie ? { ...prev, movie: { ...prev.movie, status } } : prev))
      }
    } catch (error) {
      console.error("Error updating movie:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update movie")
      throw error
    } finally {
      setIsUpdating(false)
    }
  }

  // Handle delete
  const handleDelete = async () => {
    if (!deleteModal.movie) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/movies/${deleteModal.movie.id}`, {
        method: "DELETE",
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Failed to delete movie")

      setMovies((prev) => prev.filter((m) => m.id !== deleteModal.movie!.id))
      toast.success("Movie deleted successfully")
      setDeleteModal({ isOpen: false, movie: null })

      if (detailModal.movie?.id === deleteModal.movie.id) {
        setDetailModal({ isOpen: false, movie: null })
      }
    } catch (error) {
      console.error("Error deleting movie:", error)
      toast.error(error instanceof Error ? error.message : "Failed to delete movie")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEdit = (movie: Movie) => {
    try {
      console.log("[v0] Navigating to edit movie:", movie)
      router.push(`/add?edit=${movie.id}`)
      setDetailModal({ isOpen: false, movie: null })
    } catch (error) {
      console.error("Error navigating to edit:", error)
      toast.error("Failed to open edit page")
    }
  }

  const refreshMovies = async () => {
    console.log("[v0] Refreshing movies data")
    setIsLoading(true)
    await fetchMovies()
  }

  useEffect(() => {
    const handleFocus = () => {
      console.log("[v0] Page focused, refreshing movies")
      refreshMovies()
    }

    window.addEventListener("focus", handleFocus)
    return () => window.removeEventListener("focus", handleFocus)
  }, [])

  const handleMovieClick = (movie: Movie) => {
    setDetailModal({ isOpen: true, movie })
  }

  useEffect(() => {
    fetchMovies()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading movies...</span>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <Navbar />
      <div className="container mx-auto px-4 py-6 md:py-8">
        <motion.div
          className="mb-6 md:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">My Watchlist</h1>
              <p className="text-muted-foreground text-sm md:text-base">
                {movies.length === 0 ? "No movies yet" : `${movies.length} movies in your collection`}
              </p>
            </div>
            {movies.length > 0 && <DownloadButton />}
          </div>
        </motion.div>

        <StatsOverview 
          movies={movies} 
          onFilterChange={setFilterStatus}
          currentFilter={filterStatus}
        />

        <SearchFilter
          onSearch={setSearchQuery}
          onFilter={setFilterStatus}
          searchQuery={searchQuery}
          filterStatus={filterStatus}
        />

        <AnimatePresence mode="wait">
          {filteredMovies.length === 0 ? (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-muted-foreground mb-4">
                {movies.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Film className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No movies in your watchlist</h3>
                    <p className="mb-6 text-sm md:text-base">Start by adding your first movie!</p>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button asChild size="mobile" className="text-base">
                        <Link href="/add" className="flex items-center space-x-2">
                          <Plus className="h-5 w-5" />
                          <span>Add Your First Movie</span>
                        </Link>
                      </Button>
                    </motion.div>
                  </motion.div>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold mb-2">No movies found</h3>
                    <p className="text-sm md:text-base">Try adjusting your search or filter criteria.</p>
                  </>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence>
                {filteredMovies.map((movie, index) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    index={index}
                    onEdit={handleEdit}
                    onClick={handleMovieClick}
                    onDelete={(id) => {
                      const movie = movies.find((m) => m.id === id)
                      if (movie) {
                        setDeleteModal({ isOpen: true, movie })
                      }
                    }}
                    onToggleStatus={handleToggleStatus}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, movie: null })}
        onConfirm={handleDelete}
        movieTitle={deleteModal.movie?.title || ""}
        isLoading={isDeleting}
      />

      <MovieDetailModal
        movie={detailModal.movie}
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, movie: null })}
        onEdit={handleEdit}
        onDelete={(id) => {
          const movie = movies.find((m) => m.id === id)
          if (movie) {
            setDeleteModal({ isOpen: true, movie })
          }
        }}
        onToggleStatus={handleToggleStatus}
        isLoading={isUpdating}
      />

      <InstallPrompt />
    </div>
  )
}
