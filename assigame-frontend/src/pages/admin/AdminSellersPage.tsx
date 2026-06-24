import { useEffect, useRef, useState } from 'react'
import { CheckCircle, Search } from 'lucide-react'
import type { Seller } from '@/types'
import { adminService } from '@/services/adminService'
import { useApparitionAuDefilement } from '@/hooks/useAnimations'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const ref = useRef<HTMLDivElement>(null)
  useApparitionAuDefilement(ref, { style: 'fadeUp' })

  const load = (q = search) => {
    setLoading(true)
    adminService.getSellers(1, 20, q).then((res) => {
      setSellers(res.data)
      setTotal(res.total)
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [])

  const handleVerify = async (id: number) => {
    await adminService.toggleSellerVerification(id)
    load()
  }

  return (
    <div ref={ref} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Vendeurs</h1>
        <p className="text-muted-foreground">{total} vendeur{total > 1 ? 's' : ''} inscrit{total > 1 ? 's' : ''}</p>
      </div>

      <div data-apparition className="relative max-w-md opacity-0">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="glass pl-10"
          placeholder="Rechercher un vendeur..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && load(search)}
        />
      </div>

      {loading ? (
        <Skeleton className="h-96 w-full rounded-2xl" />
      ) : (
        <div data-apparition className="glass-panel overflow-hidden opacity-0">
          <div className="space-y-3 p-4 md:hidden">
            {sellers.map((seller) => (
              <div key={seller.id} className="rounded-2xl border border-border/60 bg-white/60 p-4">
                <div className="flex gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{seller.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {seller.ville} · {seller.productCount} produit{seller.productCount > 1 ? 's' : ''}
                    </p>
                    <p className="text-sm text-muted-foreground">Note {seller.rating.toFixed(1)}</p>
                    <Badge className="mt-2" variant={seller.verified ? 'default' : 'secondary'}>
                      {seller.verified ? 'Vérifié' : 'En attente'}
                    </Badge>
                  </div>
                </div>
                <div className="mt-3">
                  <Button variant="outline" size="sm" className="glass w-full sm:w-auto" onClick={() => handleVerify(seller.id)}>
                    <CheckCircle className="size-4" />
                    {seller.verified ? 'Retirer la vérification' : 'Vérifier'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Vendeur</TableHead>
                <TableHead>Ville</TableHead>
                <TableHead>Produits</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sellers.map((seller) => (
                <TableRow key={seller.id}>
                  <TableCell>
                    <span className="font-medium">{seller.name}</span>
                  </TableCell>
                  <TableCell>{seller.ville}</TableCell>
                  <TableCell>{seller.productCount}</TableCell>
                  <TableCell>{seller.rating.toFixed(1)}</TableCell>
                  <TableCell>
                    <Badge variant={seller.verified ? 'default' : 'secondary'}>
                      {seller.verified ? 'Vérifié' : 'En attente'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="glass" onClick={() => handleVerify(seller.id)}>
                      <CheckCircle className="size-4" />
                      {seller.verified ? 'Retirer' : 'Vérifier'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </div>
      )}
    </div>
  )
}
