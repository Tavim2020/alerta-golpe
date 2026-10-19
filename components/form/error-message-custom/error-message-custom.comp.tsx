import { FieldErrors, FieldName, FieldValues } from 'react-hook-form'
import {
  ErrorMessage,
  FieldValuesFromFieldErrors,
} from '@hookform/error-message'
import { IErrorMessageCustomProps } from '.'

export const ErrorMessageCustom = <GProps extends FieldValues>({
  errors,
  name,
}: IErrorMessageCustomProps<GProps>) => {
  return (
    <ErrorMessage
      errors={errors}
      name={
        name as unknown as FieldName<
          FieldValuesFromFieldErrors<FieldErrors<GProps>>
        >
      }
      render={({ message }) => (
        <p className="text-[.625rem] text-red-500">{message}</p>
      )}
    />
  )
}
