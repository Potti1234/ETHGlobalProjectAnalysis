import { cn } from '@/lib/utils'
import { ChevronUpIcon } from '@radix-ui/react-icons'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'

export default function ScrollToTopButton ({
  className
}: {
  className?: string
}) {
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const checkScrollHeight = () => {
      if (!showButton && window.scrollY > 400) {
        setShowButton(true)
      } else if (showButton && window.scrollY <= 400) {
        setShowButton(false)
      }
    }

    window.addEventListener('scroll', checkScrollHeight)
    return () => window.removeEventListener('scroll', checkScrollHeight)
  }, [showButton])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    showButton && (
      <Button
        variant='link'
        className={cn(
          'mx-auto mb-2 size-10 items-center gap-1 rounded-full p-0 transition-all duration-150 ease-in-out hover:bg-popover',
          className
        )}
        disabled={!showButton}
        onClick={scrollToTop}
      >
        <ChevronUpIcon className='scale-150 text-foreground' />
      </Button>
    )
  )
}
