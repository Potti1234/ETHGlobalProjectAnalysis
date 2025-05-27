import Header from '@/components/header/header'
import Footer from '@/components/footer/footer'
import Spinner from '@/components/shared/spinner'
import { Button } from '@/components/ui/button'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  MapIcon,
  GlobeIcon,
  PlaneIcon,
  HeartIcon,
  UsersIcon,
  SearchIcon,
  HotelIcon
} from 'lucide-react'

export const Route = createFileRoute('/')({
  component: HomePage,
  pendingComponent: Spinner,
  beforeLoad: async () => {
    return { getTitle: () => 'Cities Been' }
  }
})

function HomePage () {
  return (
    <div>
      <Header />
      <main className='flex flex-col items-center'>
        {/* Hero Section */}
        <section className='relative w-full bg-gradient-to-b from-primary/10 to-background px-6 py-24 text-center'>
          <h1 className='mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl'>
            Your Personal
            <span className='text-primary'> Travel Tracker</span>
            <br />& Planner
          </h1>
          <p className='mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground'>
            Track your travels, discover new destinations, and plan your next
            adventure. Join millions of travelers documenting their journey
            around the world.
          </p>
          <div className='mt-10 flex items-center justify-center gap-6'>
            <Button asChild size='lg' className='h-12 px-8'>
              <Link to='/auth/register'>Start Tracking Now</Link>
            </Button>
            <Button asChild variant='outline' size='lg' className='h-12 px-8'>
              <Link to='/auth/login'>Sign In</Link>
            </Button>
          </div>
        </section>

        {/* Search Section */}
        <section className='w-full bg-muted/40 px-6 py-12'>
          <div className='mx-auto max-w-3xl text-center'>
            <div className='flex items-center justify-center gap-2 rounded-full bg-background p-1 shadow-lg'>
              <SearchIcon className='ml-4 size-5 text-muted-foreground' />
              <input
                type='text'
                placeholder='Search cities, countries, or regions...'
                className='w-full bg-transparent px-4 py-2 focus:outline-none'
              />
              <Button className='rounded-full px-6'>Search</Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className='w-full px-6 py-24'>
          <div className='mx-auto max-w-7xl'>
            <h2 className='text-center text-3xl font-bold'>
              Everything You Need to Track & Plan
            </h2>
            <div className='mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4'>
              <FeatureCard
                icon={<MapIcon className='size-8 text-primary' />}
                title='Track Visited Places'
                description="Mark cities and countries you've visited. Build your personal travel map."
              />
              <FeatureCard
                icon={<GlobeIcon className='size-8 text-primary' />}
                title='Discover Insights'
                description='Get detailed information about cities and countries around the world.'
              />
              <FeatureCard
                icon={<PlaneIcon className='size-8 text-primary' />}
                title='Plan Your Trips'
                description='Find the best routes and transportation options for your next adventure.'
              />
              <FeatureCard
                icon={<HotelIcon className='size-8 text-primary' />}
                title='Find Accommodation'
                description='Browse and book hotels, hostels, and apartments worldwide.'
              />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className='w-full bg-muted/40 px-6 py-24'>
          <div className='mx-auto max-w-7xl'>
            <div className='grid grid-cols-2 gap-8 md:grid-cols-4'>
              <StatCard number='1M+' label='Active Travelers' />
              <StatCard number='195+' label='Countries Covered' />
              <StatCard number='10K+' label='Cities Listed' />
              <StatCard number='500K+' label='Trips Planned' />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className='w-full px-6 py-24'>
          <div className='mx-auto max-w-7xl'>
            <h2 className='mb-16 text-center text-3xl font-bold'>
              What Our Travelers Say
            </h2>
            <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
              <TestimonialCard
                quote="WebAppTemplate helps me keep track of all my travels. It's become an essential part of my journey!"
                author='Sarah M.'
                location='Digital Nomad'
              />
              <TestimonialCard
                quote="The best travel tracking app I've used. Simple, beautiful, and actually useful."
                author='James K.'
                location='Adventure Traveler'
              />
              <TestimonialCard
                quote="Perfect for planning future trips while keeping track of where I've been."
                author='Maria L.'
                location='Travel Blogger'
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className='w-full bg-primary px-6 py-24 text-primary-foreground'>
          <div className='mx-auto max-w-3xl text-center'>
            <h2 className='text-3xl font-bold'>
              Start Your Travel Journey Today
            </h2>
            <p className='mt-4 text-lg text-primary-foreground/80'>
              Join millions of travelers documenting their adventures around the
              world.
            </p>
            <Button
              asChild
              size='lg'
              variant='secondary'
              className='mt-8 h-12 px-8'
            >
              <Link to='/auth/register'>Get Started - It's Free</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

function FeatureCard ({
  icon,
  title,
  description
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className='flex flex-col items-center text-center'>
      <div className='mb-4 rounded-full bg-primary/10 p-3'>{icon}</div>
      <h3 className='mb-2 text-xl font-semibold'>{title}</h3>
      <p className='text-sm text-muted-foreground'>{description}</p>
    </div>
  )
}

function StatCard ({ number, label }: { number: string; label: string }) {
  return (
    <div className='text-center'>
      <div className='text-3xl font-bold text-primary'>{number}</div>
      <div className='mt-1 text-sm text-muted-foreground'>{label}</div>
    </div>
  )
}

function TestimonialCard ({
  quote,
  author,
  location
}: {
  quote: string
  author: string
  location: string
}) {
  return (
    <div className='rounded-lg bg-muted/40 p-6'>
      <div className='mb-4 text-primary'>
        <HeartIcon className='size-6' />
      </div>
      <p className='mb-4 text-sm text-muted-foreground'>{quote}</p>
      <div className='flex items-center gap-2'>
        <div className='rounded-full bg-primary/10 p-2'>
          <UsersIcon className='size-4 text-primary' />
        </div>
        <div>
          <div className='font-semibold'>{author}</div>
          <div className='text-xs text-muted-foreground'>{location}</div>
        </div>
      </div>
    </div>
  )
}
