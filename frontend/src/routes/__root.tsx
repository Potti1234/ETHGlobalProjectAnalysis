import { Outlet, useLocation } from '@tanstack/react-router'
import { createRootRoute } from '@tanstack/react-router'
import { Toaster } from 'sonner'
import { ScrollRestoration } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/sidebar/app-sidebar'

export const Route = createRootRoute({
  component: () => {
    const location = useLocation()
    const { pathname } = location

    const hideSidebarRoutes = [
      '/',
      '/auth/login',
      '/auth/register',
      '/auth/forgot-password',
      '/auth/reset-password',
      '/auth/verify-email'
    ]
    // Check if the current pathname starts with any of the /auth sub-routes or is the index page
    const shouldShowSidebar = !hideSidebarRoutes.some(route => {
      if (route.endsWith('/*')) {
        return pathname.startsWith(route.slice(0, -2))
      }
      if (
        route === '/auth/login' ||
        route === '/auth/register' ||
        route === '/auth/forgot-password' ||
        route === '/auth/reset-password' ||
        route === '/auth/verify-email'
      ) {
        return pathname.startsWith('/auth')
      }
      return pathname === route
    })

    return (
      <div className='mx-auto flex min-h-dvh flex-col gap-4 px-4 py-2'>
        {shouldShowSidebar ? (
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header>
                <SidebarTrigger />
              </header>
              <ScrollRestoration />
              <Outlet />
              <Toaster
                position='bottom-center'
                toastOptions={{ duration: 2500 }}
              />
              {process.env.NODE_ENV === 'development' && (
                <TanStackRouterDevtools position='bottom-right' />
              )}
            </SidebarInset>
          </SidebarProvider>
        ) : (
          <>
            <ScrollRestoration />
            <Outlet />
            <Toaster
              position='bottom-center'
              toastOptions={{ duration: 2500 }}
            />
            {process.env.NODE_ENV === 'development' && (
              <TanStackRouterDevtools position='bottom-right' />
            )}
          </>
        )}
      </div>
    )
  }
})
