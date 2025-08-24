import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const movies = await query("SELECT * FROM movies ORDER BY id DESC")
    return NextResponse.json(movies)
  } catch (error) {
    console.error("Error fetching movies:", error)
    return NextResponse.json({ error: "Failed to fetch movies" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, year, status } = await request.json()

    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    if (!year || year < 1900 || year > new Date().getFullYear() + 5) {
      return NextResponse.json({ error: "Valid year is required" }, { status: 400 })
    }

    if (!status || !["watched", "unwatched"].includes(status)) {
      return NextResponse.json({ error: "Valid status is required" }, { status: 400 })
    }

    const result = await query("INSERT INTO movies (title, year, status) VALUES (?, ?, ?)", [
      title.trim(),
      year,
      status,
    ])

    return NextResponse.json({ message: "Movie added successfully", id: (result as any).insertId }, { status: 201 })
  } catch (error) {
    console.error("Error adding movie:", error)
    return NextResponse.json({ error: "Failed to add movie" }, { status: 500 })
  }
}
