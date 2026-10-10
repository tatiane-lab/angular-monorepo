import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function minLengthTrimmed(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const trimmed = (control.value ?? '').trim();
    return trimmed.length >= min ? null : { minLengthTrimmed: { required: min, actual: trimmed.length } };
  };
}

export function noWhitespace(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const hasWhitespace = /\s/.test(control.value ?? '');
    return hasWhitespace ? { noWhitespace: true } : null;
  };
}

export function matchFields(field1: string, field2: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const val1 = group.get(field1)?.value;
    const val2 = group.get(field2)?.value;
    return val1 === val2 ? null : { fieldsMismatch: { fields: [field1, field2] } };
  };
}
