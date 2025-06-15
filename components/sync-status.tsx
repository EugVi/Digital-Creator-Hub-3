"use client"

import { useState, useEffect } from "react"
import { Cloud, CloudOff, Wifi, WifiOff } from "lucide-react"
import { syncService } from "../lib/sync-service"
import { db } from "../lib/database"

export function SyncStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [syncEnabled, setSyncEnabled] = useState(false)
  const [lastSync, setLastSync] = useState<number | null>(null)

  useEffect(() => {
    // Check initial status
    const checkStatus = () => {
      const user = db.getCurrentUser()
      if (user) {
        const syncStatus = syncService.getSyncStatus(user.username)
        setSyncEnabled(syncStatus.enabled)
        setLastSync(syncStatus.lastSync || null)
      }
      setIsOnline(syncService.getDeviceInfo().online)
    }

    checkStatus()

    // Update status periodically
    const interval = setInterval(checkStatus, 5000)

    return () => clearInterval(interval)
  }, [])

  if (!syncEnabled) {
    return (
      <div className="flex items-center gap-1 text-gray-400">
        <CloudOff className="h-4 w-4" />
        <span className="text-xs">Local</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1">
      {isOnline ? (
        <>
          <Cloud className="h-4 w-4 text-blue-500" />
          <Wifi className="h-3 w-3 text-green-500" />
        </>
      ) : (
        <>
          <CloudOff className="h-4 w-4 text-gray-400" />
          <WifiOff className="h-3 w-3 text-red-500" />
        </>
      )}
      <span className="text-xs text-gray-600">{isOnline ? "Synced" : "Offline"}</span>
    </div>
  )
}
