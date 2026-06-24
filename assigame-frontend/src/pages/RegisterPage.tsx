import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/contexts/AuthContext'
import { authService } from '@/services/authService'
import { CITIES } from '@/lib/constants'
import { Logo } from '@/components/shared/Logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const schema = z.object({
  nom: z.string().min(2, 'Nom requis'),
  prenom: z.string().min(2, 'Prénom requis'),
  telephone: z.string().min(8, 'Téléphone invalide'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Minimum 8 caractères'),
  ville: z.string().min(1, 'Ville requise'),
})

type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setError('')
    try {
      const { user } = await authService.register(data)
      login(user)
      navigate('/vendeur', { replace: true })
    } catch {
      setError('Une erreur est survenue. Réessayez.')
    }
  }

  return (
    <div className="page-gradient relative flex min-h-screen items-center justify-center px-4 pb-12 pt-24">
      <div className="glass-panel relative w-full max-w-lg p-8 sm:p-10">
        <div className="mb-8 flex justify-center">
          <Logo size="xl" />
        </div>
        <h1 className="text-center text-2xl font-bold">Devenir vendeur</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Créez votre boutique sur Assigamé
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="prenom">Prénom</Label>
            <Input id="prenom" className="glass" {...register('prenom')} />
            {errors.prenom && <p className="text-sm text-red-500">{errors.prenom.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="nom">Nom</Label>
            <Input id="nom" className="glass" {...register('nom')} />
            {errors.nom && <p className="text-sm text-red-500">{errors.nom.message}</p>}
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" className="glass" {...register('email')} />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="telephone">Téléphone</Label>
            <Input id="telephone" className="glass" {...register('telephone')} />
          </div>
          <div className="space-y-2">
            <Label>Ville</Label>
            <Select value={watch('ville')} onValueChange={(v) => setValue('ville', v)}>
              <SelectTrigger className="glass">
                <SelectValue placeholder="Choisir" />
              </SelectTrigger>
              <SelectContent>
                {CITIES.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input id="password" type="password" className="glass" {...register('password')} />
          </div>
          {error && <p className="text-sm text-red-500 sm:col-span-2">{error}</p>}
          <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 sm:col-span-2" disabled={isSubmitting}>
            {isSubmitting ? 'Création...' : 'Créer mon compte vendeur'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Déjà inscrit ?{' '}
          <Link to="/connexion" className="font-medium text-primary hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
