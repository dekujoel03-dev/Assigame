import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/contexts/AuthContext'
import { authService } from '@/services/authService'
import { getDefaultAppPath, getSafeRedirectPath } from '@/lib/security'
import { Logo } from '@/components/shared/Logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Minimum 6 caractères'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState('')
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setError('')
    try {
      const { user } = await authService.login(data)
      login(user)
      const redirectTo = getSafeRedirectPath(from) ?? getDefaultAppPath(user.role)
      navigate(redirectTo, { replace: true })
    } catch {
      setError('Email ou mot de passe incorrect')
    }
  }

  return (
    <div className="page-gradient relative flex min-h-screen items-center justify-center px-4 pb-12 pt-24">
      <div className="pointer-events-none absolute left-1/4 top-20 size-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 right-1/4 size-48 rounded-full bg-secondary/10 blur-3xl" />

      <div className="glass-panel relative w-full max-w-md p-8 sm:p-10">
        <div className="mb-8 flex justify-center">
          <Logo size="xl" />
        </div>
        <h1 className="text-center text-2xl font-bold">Connexion</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Accédez à votre espace vendeur ou admin
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" className="glass" placeholder="vous@exemple.tg" {...register('email')} />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input id="password" type="password" className="glass" {...register('password')} />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90" disabled={isSubmitting}>
            {isSubmitting ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Pas encore vendeur ?{' '}
          <Link to="/inscription" className="font-medium text-primary hover:underline">
            S&apos;inscrire
          </Link>
        </p>
        {import.meta.env.DEV && (
          <p className="mt-4 rounded-xl bg-primary/5 p-3 text-center text-xs text-muted-foreground">
            Démo : admin@assigame.tg / admin123 · kodjo@assigame.tg / seller123
          </p>
        )}
      </div>
    </div>
  )
}
