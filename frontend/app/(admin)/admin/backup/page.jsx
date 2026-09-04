"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Loader2, Database } from "lucide-react"
import api from "@/service/api"
import { toast } from "sonner"

export default function Page() {
  const [isDownloading, setIsDownloading] = useState(false)
  const [lastBackupDate, setLastBackupDate] = useState(null)
  const [lastBackupSize, setLastBackupSize] = useState(null)

  const handleDownloadBackup = async () => {
    setIsDownloading(true)
    try {
      const response = await api.get("/admin/backup")
      if (response.data?.success && response.data?.data) {
        // Convert the JSON payload to a Blob
        const jsonStr = JSON.stringify(response.data.data, null, 2)
        const blob = new Blob([jsonStr], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        
        // Create a temporary link to trigger download
        const a = document.createElement("a")
        a.href = url
        a.download = `database_backup_${new Date().toISOString().slice(0,10)}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        setLastBackupDate(new Date(response.data.backupDate).toLocaleString())
        setLastBackupSize((blob.size / 1024 / 1024).toFixed(2) + " MB")
        toast.success(`Backup downloaded successfully! (${response.data.collections} collections)`)
      } else {
        throw new Error("Invalid backup data format")
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to download backup")
    }
    setIsDownloading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-navy">Database Backup</h1>
        <p className="text-muted-foreground">Admin export tool to secure your data.</p>
      </div>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-accent" />
            Full System Export
          </CardTitle>
          <CardDescription>
            Download a complete snapshot of all database collections in JSON format. 
            This file can be used to restore the system in case of catastrophic data loss.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-muted/50 p-4 border border-border">
            <h4 className="text-sm font-semibold mb-2">What is included?</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>All registered users and members</li>
              <li>Donation records and transactions</li>
              <li>Projects, Events, and Campaigns</li>
              <li>Site Content (CMS)</li>
              <li>Gallery and News</li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 font-semibold"
              onClick={handleDownloadBackup}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Download className="mr-2 h-5 w-5" />
              )}
              {isDownloading ? "Generating Backup..." : "Download Database Backup (.json)"}
            </Button>
            
            {lastBackupDate && (
              <p className="text-xs text-muted-foreground">
                Last generated in this session: <span className="font-semibold text-foreground">{lastBackupDate}</span> (Size: {lastBackupSize})
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
