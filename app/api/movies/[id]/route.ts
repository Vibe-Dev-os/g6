import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid movie ID" }, { status: 400 })
    }

    const movies = await query("SELECT * FROM movies WHERE id = ?", [id])

    if (!Array.isArray(movies) || movies.length === 0) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 })
    }

    return NextResponse.json(movies[0])
  } catch (error) {
    console.error("Error fetching movie:", error)
    return NextResponse.json({ error: "Failed to fetch movie" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { title, year, status } = await request.json()
    const { id } = params

    console.log("[v0] PUT request received:", { id, title, year, status }) // Added debug logging

    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    if (!year || year < 1900 || year > new Date().getFullYear() + 5) {
      return NextResponse.json({ error: "Valid year is required" }, { status: 400 })
    }

    if (!status || !["watched", "unwatched"].includes(status)) {
      return NextResponse.json({ error: "Valid status is required" }, { status: 400 })
    }

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid movie ID" }, { status: 400 })
    }

    const result = await query("UPDATE movies SET title = ?, year = ?, status = ? WHERE id = ?", [
      title.trim(),
      year,
      status,
      id,
    ])

    console.log("[v0] Database update result:", result) // Added debug logging

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 })
    }

    const updatedMovie = await query("SELECT * FROM movies WHERE id = ?", [id])
    console.log("[v0] Updated movie:", updatedMovie)

    return NextResponse.json({
      message: "Movie updated successfully",
      movie: Array.isArray(updatedMovie) ? updatedMovie[0] : null,
    })
  } catch (error) {
    console.error("Error updating movie:", error)
    return NextResponse.json({ error: "Failed to update movie" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid movie ID" }, { status: 400 })
    }

    const result = await query("DELETE FROM movies WHERE id = ?", [id])

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Movie deleted successfully" })
  } catch (error) {
    console.error("Error deleting movie:", error)
    return NextResponse.json({ error: "Failed to delete movie" }, { status: 500 })
  }
}
