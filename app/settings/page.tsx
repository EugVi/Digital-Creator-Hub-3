"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Cloud } from "lucide-react"
import { SyncStatus } from "../../components/sync-status"

const db = {
  toggleCloudSync: async (checked: boolean) => {
    return new Promise<{ success: boolean }>((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 500)
    })
  },
  forceSyncToCloud: async () => {
    return new Promise<{ success: boolean }>((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 500)
    })
  },
}

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    cloudSync: false,
  })

  return (
    <div className="container max-w-4xl py-6">
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-base">Cloud Sync</CardTitle>
              <CardDescription>Synchronize your data across multiple devices</CardDescription>
            </div>
            <SyncStatus />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Enable Cloud Sync</Label>
                <p className="text-xs text-muted-foreground">Access your data from any device</p>
              </div>
              <Switch
                checked={settings.cloudSync}
                onCheckedChange={async (checked) => {
                  const result = await db.toggleCloudSync(checked)
                  if (result.success) {
                    setSettings({ ...settings, cloudSync: checked })
                  }
                }}
              />
            </div>

            {settings.cloudSync && (
              <div className="space-y-2 pt-2 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span>Status:</span>
                  <SyncStatus />
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    const result = await db.forceSyncToCloud()
                    // Handle result
                  }}
                  className="w-full"
                >
                  <Cloud className="h-4 w-4 mr-2" />
                  Force Sync Now
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
