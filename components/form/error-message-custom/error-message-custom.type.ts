import { FieldErrors, FieldValues, Path } from 'react-hook-form'

export interface IErrorMessageCustomProps<GProps extends FieldValues> {
  name: Path<GProps>
  errors: FieldErrors<GProps>
}
