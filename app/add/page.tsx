"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { MovieForm } from "@/components/movie-form"
import { Navbar } from "@/components/navbar"
import type { Movie, MovieFormData } from "@/types/movie"
import toast from "react-hot-toast"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AddMoviePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [editMovie, setEditMovie] = useState<Movie | null>(null)
  const [isLoadingMovie, setIsLoadingMovie] = useState(false)

  useEffect(() => {
    const editId = searchParams.get("edit")
    if (editId) {
      setIsLoadingMovie(true)
      // Fetch the movie data from API instead of localStorage
      fetch(`/api/movies/${editId}`)
        .then((res) => res.json())
        .then((movie) => {
          if (movie.error) {
            toast.error("Movie not found")
            router.push("/")
          } else {
            setEditMovie(movie)
          }
        })
        .catch((error) => {
          console.error("Error fetching movie:", error)
          toast.error("Failed to load movie")
          router.push("/")
        })
        .finally(() => setIsLoadingMovie(false))
    }
  }, [searchParams, router])

  const handleSubmit = async (data: MovieFormData) => {
    setIsLoading(true)
    try {
      const url = editMovie ? `/api/movies/${editMovie.id}` : "/api/movies"
      const method = editMovie ? "PUT" : "POST"

      console.log("[v0] Submitting movie data:", { url, method, data }) // Added debug logging

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      console.log("[v0] API response:", result) // Added debug logging

      if (!response.ok) {
        throw new Error(result.error || `Failed to ${editMovie ? "update" : "add"} movie`)
      }

      toast.success(`Movie ${editMovie ? "updated" : "added"} successfully!`)

      if (editMovie) {
        // Add a small delay to ensure the database update is complete
        setTimeout(() => {
          router.push("/")
          router.refresh()
        }, 100)
      } else {
        router.push("/")
      }
    } catch (error) {
      console.error(`Error ${editMovie ? "updating" : "adding"} movie:`, error)
      toast.error(error instanceof Error ? error.message : `Failed to ${editMovie ? "update" : "add"} movie`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push("/")
  }

  if (isLoadingMovie) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading movie...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Watchlist</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold mb-2">{editMovie ? "Edit Movie" : "Add New Movie"}</h1>
          <p className="text-muted-foreground">
            {editMovie ? "Update the movie details below" : "Add a new movie to your watchlist"}
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <MovieForm movie={editMovie} onSubmit={handleSubmit} onCancel={handleCancel} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}
