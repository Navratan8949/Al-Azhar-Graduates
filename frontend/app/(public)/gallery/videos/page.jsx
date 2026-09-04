import { redirect } from "next/navigation"

// Videos are now part of the unified Gallery page
export default function VideoGalleryPage() {
  redirect("/gallery/photos")
}
