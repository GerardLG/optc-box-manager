import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { consumeRedirectSearchParam } from '../router/githubPagesRedirect'

/** Aplica el fallback de GitHub Pages (`?redirect=` desde 404.html). */
export function GithubPagesRedirect() {
  const navigate = useNavigate()

  useEffect(() => {
    const target = consumeRedirectSearchParam()
    if (target) navigate(target, { replace: true })
  }, [navigate])

  return null
}
