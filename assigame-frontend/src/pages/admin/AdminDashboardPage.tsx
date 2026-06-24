import { useEffect, useRef, useState } from 'react'
import { FolderTree, Package, Users, UserCircle } from 'lucide-react'
import type { Activity, AdminStats } from '@/types'
import { adminService } from '@/services/adminService'
import { useApparitionAuDefilement } from '@/hooks/useAnimations'
import { Skeleton } from '@/components/ui/skeleton'

const statIcons = [UserCircle, Users, Package, FolderTree]

export default function AdminDashboardPage() {
  const [CHIFFRES_CLES, setStats] = useState<AdminStats | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const ref = useRef<HTMLDivElement>(null)
  useApparitionAuDefilement(ref, { style: 'scaleIn', decalageMs: 100 })

  useEffect(() => {
    Promise.all([adminService.getStats(), adminService.getActivities()]).then(([s, a]) => {
      setStats(s)
      setActivities(a)
      setLoading(false)
    })
  }, [])

  const statItems = CHIFFRES_CLES
    ? [
        { label: 'Utilisateurs', value: CHIFFRES_CLES.totalUsers.toLocaleString('fr-FR'), icon: statIcons[0] },
        { label: 'Vendeurs', value: CHIFFRES_CLES.totalSellers, icon: statIcons[1] },
        { label: 'Produits', value: CHIFFRES_CLES.totalProducts.toLocaleString('fr-FR'), icon: statIcons[2] },
        { label: 'Catégories', value: CHIFFRES_CLES.totalCategories, icon: statIcons[3] },
      ]
    : []

  return (
    <div ref={ref} className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Administration</h1>
        <p className="text-muted-foreground">Vue d&apos;ensemble de la plateforme Assigamé</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)
          : statItems.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                data-apparition
                className="glass-card flex items-center gap-4 p-6 opacity-0 transition-transform hover:-translate-y-0.5"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="text-2xl font-bold">{value}</p>
                </div>
              </div>
            ))}
      </div>

      <div data-apparition className="glass-panel p-6 opacity-0 sm:p-8">
        <h2 className="mb-6 text-lg font-bold">Activité récente</h2>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 py-4">
                <div className="mt-0.5 size-2 shrink-0 rounded-full bg-secondary" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm">{activity.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
