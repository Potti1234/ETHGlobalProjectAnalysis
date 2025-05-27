import InputField from '@/components/form/input-field'
import PasswordField from '@/components/form/password-field'
import { GoogleLogo } from '@/components/shared/logos'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import useAuth from '@/hooks/use-auth'
import { useThrottle } from '@/hooks/use-throttle'
import { LoginFields, loginSchema } from '@/schemas/auth-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, redirect } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { createFileRoute } from '@tanstack/react-router'
import Spinner from '@/components/shared/spinner'
import {
  checkEmailIsVerified,
  checkUserIsLoggedIn,
  checkVerifiedUserIsLoggedIn
} from '@/services/api-auth'

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
  pendingComponent: Spinner,
  beforeLoad: async () => {
    if (checkUserIsLoggedIn() && !checkEmailIsVerified())
      throw redirect({ to: '/auth/verify-email' })
    if (checkVerifiedUserIsLoggedIn()) throw redirect({ to: '/map' })
    return { getTitle: () => 'Login' }
  }
})

function LoginPage () {
  const { loginWithPassword, loginWithGoogle } = useAuth()

  const form = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const [handleLogin, isLoggingIn] = useThrottle(
    ({ email, password }: LoginFields) => loginWithPassword(email, password)
  )

  return (
    <main className='mx-auto flex w-full max-w-[350px] flex-col items-center gap-y-4'>
      <h2 className='mt-4 text-4xl font-bold'>Log In</h2>
      <p className='text-center text-xl font-light text-muted-foreground'>
        Sign in to your account
      </p>
      <Form {...form}>
        <form
          className='flex w-full flex-col items-center gap-y-4'
          onSubmit={form.handleSubmit(handleLogin)}
        >
          <InputField form={form} name='email' type='email' />
          <PasswordField form={form} name='password' />

          <Link
            to='/auth/forgot-password'
            className='ml-auto text-sm text-primary'
          >
            Forgot password
          </Link>
          <Button
            className='w-full'
            type='submit'
            disabled={!form.formState.isDirty || isLoggingIn}
          >
            Login
          </Button>
          <Button
            className='w-full'
            variant='secondary'
            type='button'
            onClick={loginWithGoogle}
          >
            <GoogleLogo />
            Sign In with Google
          </Button>
        </form>
      </Form>
      <p className='text-sm'>
        Don&apos;t have an account?{' '}
        <Link to='/auth/register' className='text-primary'>
          Register
        </Link>
      </p>
    </main>
  )
}
