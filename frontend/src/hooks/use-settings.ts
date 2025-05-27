import { usePlausible } from '@/context/plausible-context'
import { errorToast, successToast } from '@/lib/toast'
import { UpdateUserSettingsFields } from '@/schemas/user-schema'
import { userQueryOptions } from '@/services/api-auth'
import { updateUserSettings } from '@/services/api-settings'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query'
import { useState } from 'react'
import { updateUserProfilePicture } from '@/services/api-auth'
import useAuth from './use-auth'
import { UserWithSettings } from '@/schemas/user-schema'

export default function useSettings() {
  const queryClient = useQueryClient()
  const { trackEvent } = usePlausible()
  const { data, isLoading } = useSuspenseQuery(userQueryOptions)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { user } = useAuth()

  const { name, id: userId, settings } = data ?? {}

  const updateSettingsMutation = useMutation({
    mutationFn: ({
      userId,
      data
    }: {
      userId: string
      data: UpdateUserSettingsFields
    }) => updateUserSettings(userId, data),

    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ['user'] })
      const previousUser = queryClient.getQueryData(['user'])

      queryClient.setQueryData(['user'], (currentUser: UserWithSettings) => ({
        ...currentUser,
        name: newData.data.name,
        settings: {
          ...currentUser.settings
        }
      }))

      return { previousUser }
    },

    onSuccess: () => {
      trackEvent('settings-update')
      successToast('Success!', 'Account details were updated successfully')
    },

    onError: (error, _, context) => {
      console.error(error)
      queryClient.setQueryData(['user'], context?.previousUser)
      errorToast('Could not update account details', error)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    }
  })

  const updateSettings = (userId: string, userData: UpdateUserSettingsFields) =>
    updateSettingsMutation.mutate({ userId, data: userData })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null)
    const file = event.target.files?.[0]
    if (file) {
      const fileType = file.type
      const fileSize = file.size / 1024 / 1024 // in MB
      if (fileType !== 'image/png') {
        setErrorMessage('Only PNG files are allowed.')
      } else if (fileSize > 1) {
        setErrorMessage('File size should be smaller than 1 MB.')
      } else {
        setSelectedFile(file)
        setErrorMessage(null)
      }
    }
  }

  const updateProfilePicture = async (file: File | null) => {
    if (!user?.id) return
    if (!file) {
      setErrorMessage('Please select a file.')
      return
    }
    if (errorMessage) return

    try {
      await updateUserProfilePicture(user.id, file)
      successToast('Profile picture updated successfully')
    } catch (error) {
      errorToast('Could not update profile picture', error)
    }
  }

  return {
    userId,
    name,
    isLoading,
    settings,
    updateSettings,
    selectedFile,
    errorMessage,
    handleFileChange,
    updateProfilePicture
  }
}
