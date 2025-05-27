import InputField from '@/components/form/input-field'
import PasswordField from '@/components/form/password-field'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import useSettings from '@/hooks/use-settings'
import {
  UpdateUserSettingsFields,
  updateUserSettingsSchema
} from '@/schemas/user-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import UploadFileField from '@/components/form/file-upload-field'
import SettingsNavigation from '@/components/settings/settingsNavigation'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { checkUserIsLoggedIn } from '@/services/api-auth'

export default function GeneralSettingsPage () {
  const formRef = useRef<HTMLFormElement>(null)
  const { userId, name, settings, updateSettings } = useSettings()

  const form = useForm<UpdateUserSettingsFields>({
    resolver: zodResolver(updateUserSettingsSchema),
    defaultValues: {
      name,
      avatar: undefined,
      oldPassword: '',
      password: '',
      passwordConfirm: ''
    }
  })

  const fieldsEdited = form.formState.isDirty

  return (
    <SettingsNavigation highlightedLink='general'>
      <div className='grid gap-6'>
        <Form {...form}>
          <form
            ref={formRef}
            className='flex w-full flex-col items-center gap-y-4'
            onSubmit={form.handleSubmit(
              userData => userId && updateSettings(userId, userData)
            )}
          >
            <Card className='w-full'>
              <CardHeader>
                <CardTitle className='pb-4 text-4xl font-bold'>
                  Settings
                </CardTitle>
                <CardDescription>Update your account settings</CardDescription>
              </CardHeader>

              <CardContent className='space-y-6'>
                <div className='space-y-4'>
                  <h2 className='text-xl font-light text-muted-foreground'>
                    Account Settings
                  </h2>

                  <UploadFileField
                    form={form}
                    name='avatar'
                    label='Avatar image'
                  />
                  <InputField form={form} name='name' />
                </div>

                {settings?.authWithPasswordAvailable && (
                  <div className='space-y-4'>
                    <h2 className='text-xl font-light text-muted-foreground'>
                      Change Password
                    </h2>

                    <PasswordField
                      form={form}
                      name='oldPassword'
                      label='Current password'
                    />
                    <PasswordField
                      form={form}
                      name='password'
                      label='New password'
                    />
                    <PasswordField
                      form={form}
                      name='passwordConfirm'
                      label='Confirm new password'
                    />
                  </div>
                )}
              </CardContent>

              <CardFooter className='grid w-full grid-cols-2 gap-4'>
                <Button
                  disabled={!fieldsEdited}
                  className='w-full'
                  type='submit'
                >
                  Update Settings
                </Button>
                <Button
                  asChild
                  variant='secondary'
                  type='button'
                  className='w-full'
                >
                  <Link to='..' preload={false}>
                    Back
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </SettingsNavigation>
  )
}

export const Route = createFileRoute('/settings/general')({
  component: GeneralSettingsPage,
  beforeLoad: () => {
    if (!checkUserIsLoggedIn()) throw redirect({ to: '/auth/login' })
    return { getTitle: () => 'General Settings' }
  }
})
