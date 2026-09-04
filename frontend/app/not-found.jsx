import Link from "next/link"
import Image from "next/image"
import { Home, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex h-20 items-center border-b border-border/40 px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/rht_logo.png" alt="World Association for Al-Azhar Graduates Logo" width={40} height={40} className="object-contain" />
          <span className="font-serif text-xl font-bold tracking-tight text-navy">World Association for Al-Azhar Graduates</span>
        </Link>
      </header>
      
      <main className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-8 flex h-40 w-40 items-center justify-center rounded-full bg-secondary/50">
          <div className="absolute inset-0 rounded-full border-4 border-dashed border-border/60 animate-spin-slow" />
          <span className="font-serif text-6xl font-bold text-navy">404</span>
        </div>
        
        <h1 className="mb-3 font-serif text-3xl font-bold text-foreground md:text-4xl">Page not found</h1>
        <p className="mb-8 max-w-md text-base text-muted-foreground">
          Sorry, we couldn't find the page you're looking for. It might have been removed, renamed, or didn't exist in the first place.
        </p>
        
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="rounded-xl px-8">
            <Link href="/">
              <Home className="mr-2 size-4" />
              Go to Homepage
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-xl px-8">
            <Link href="/contact">
              Contact Support
            </Link>
          </Button>
        </div>
      </main>
      
      <footer className="py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} World Association for Al-Azhar Graduates.
      </footer>
    </div>
  )
}
