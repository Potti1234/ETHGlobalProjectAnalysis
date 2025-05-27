import ScrollToTopButton from '@/components/footer/scroll-to-top'
import { GitHubLogoIcon } from '@radix-ui/react-icons'
import { Link } from '@tanstack/react-router'

export default function Footer () {
  return (
    <footer className='mt-auto flex w-full flex-col pt-4'>
      <ScrollToTopButton />
      <div className='grid select-none grid-cols-1 gap-1 px-2 text-xs text-muted-foreground md:grid-cols-3'>
        <p className='text-center md:text-left'>
          © {new Date().getFullYear()}{' '}
          <a target='_blank' rel='noreferrer' href='https://lukaspottner.com'>
            Lukas Pottner
          </a>
        </p>{' '}
        <div className='text-center'>
          <a
            target='_blank'
            rel='noreferrer'
            className='flex items-center justify-center'
            href='https://github.com/Potti1234/WhereHaveIBeenTo'
          >
            <GitHubLogoIcon className='mr-1' />
            Source Code
          </a>
        </div>
        <p className='text-center md:text-right'>
          <Link resetScroll={true} to='/privacypolicy'>
            Privacy Policy
          </Link>
        </p>
      </div>
    </footer>
  )
}
