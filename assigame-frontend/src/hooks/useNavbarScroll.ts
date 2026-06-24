import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

function getHomeScrollOffset(): number {
  const scrollEl = document.querySelector<HTMLElement>('.home-scroll')
  if (scrollEl && scrollEl.scrollHeight > scrollEl.clientHeight + 1) {
    return scrollEl.scrollTop
  }
  return window.scrollY
}

export function useNavbarScroll(threshold = 8) {
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    setScrolled(false)

    const update = () => {
      const offset = pathname === '/' ? getHomeScrollOffset() : window.scrollY
      setScrolled(offset > threshold)
    }

    update()

    const onScroll = () => update()

    if (pathname === '/') {
      let scrollEl: HTMLElement | null = null
      let detach: (() => void) | undefined
      let retryId: number | undefined

      const attach = () => {
        scrollEl = document.querySelector<HTMLElement>('.home-scroll')
        if (!scrollEl) return false

        scrollEl.addEventListener('scroll', onScroll, { passive: true })
        detach = () => scrollEl?.removeEventListener('scroll', onScroll)
        return true
      }

      window.addEventListener('scroll', onScroll, { passive: true })

      if (!attach()) {
        retryId = window.setInterval(() => {
          if (attach() && retryId) {
            window.clearInterval(retryId)
            retryId = undefined
          }
        }, 50)
      }

      return () => {
        if (retryId) window.clearInterval(retryId)
        window.removeEventListener('scroll', onScroll)
        detach?.()
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname, threshold])

  return scrolled
}
