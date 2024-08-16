import { useCallback, useContext, useMemo, useState } from 'react';
import { randomSuccessOrFailure, toastContext, useTextField } from 'common';

export interface ResourceDetails {
  name: string;
  id: string;
  createdOn: Date;
}

export const useResourceTableRow = (initialState?: ResourceDetails) => {
  const { addMessage } = useContext(toastContext)
  const [id, setId] = useState<string | undefined>(initialState?.id)
  const nameField = useTextField(initialState?.name)
  const [createdOn, setCreatedOn] = useState<Date | undefined>(initialState?.createdOn)

  const [hasError, setHasError] = useState(false)
  const isNew = useMemo(() => !id, [id])

  const handleSetErrorMessage = useCallback((error?: Error) => {
    setHasError(!!error)
    if (error)
      addMessage({
        level: 'error',
        message: error.message,
        details: error?.cause as string | undefined
      })
  }, [setHasError, addMessage])

  const handleSave = useCallback(() => {
    if (!nameField.value) {
      const error = Error("Validation error", { cause: "name field was not set" })
      handleSetErrorMessage(error)
      return Promise.reject(error)
    }

    return randomSuccessOrFailure({ id, name: nameField.value })
      .catch(() => { throw Error("Save failed", { cause: "api failed for reasons" }) })
      .then((): ResourceDetails => {
        // simulating result from an api call
        const savedResourceDetails: ResourceDetails = {
          id: id ?? `r${Math.floor(Math.random() * 100000)}`,
          name: nameField.value ?? "",
          createdOn: createdOn ?? new Date()
        }
        setCreatedOn(savedResourceDetails.createdOn)
        setId(savedResourceDetails.id)
        setHasError(false)
        return savedResourceDetails
      })
      .catch((msg: Error) => {
        handleSetErrorMessage(msg)
        throw msg
      })
  }, [id, nameField, createdOn, handleSetErrorMessage])

  const handleDelete = useCallback(() => {
    return randomSuccessOrFailure(id)
      .catch(() => {
        const error = Error("Delete failed", { cause: "Could not delete for reasons" })
        handleSetErrorMessage(error)
        throw error
      })
  }, [id, handleSetErrorMessage])

  return {
    id,
    nameField,
    createdOn,
    isNew,
    hasError,
    handleSave,
    handleDelete
  }
}
