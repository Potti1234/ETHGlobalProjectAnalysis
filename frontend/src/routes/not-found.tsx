import { Button } from '@/components/ui/button'
import { usePlausible } from '@/context/plausible-context'
import { createFileRoute, useLocation, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'

export default function NotFoundPage () {
  const { history } = useRouter()
  const location = useLocation()
  const { trackEvent } = usePlausible()

  useEffect(() => {
    trackEvent('404', { props: { path: location.pathname } })
  }, [])

  return (
    <main className='flex flex-col items-center gap-y-4 text-center'>
      <img
        src='/images/CitiesbeenNotFound.png'
        alt='Page Not Found'
        className='mt-8 max-w-sm'
      />
      <Button
        variant='link'
        className='w-32 hover:no-underline'
        onClick={() => history.go(-1)}
      >
        ← Go back
      </Button>
    </main>
  )
}

export const Route = createFileRoute('/not-found')({
  component: NotFoundPage,
  beforeLoad: () => {
    return { getTitle: () => 'This page does not exist' }
  }
})
