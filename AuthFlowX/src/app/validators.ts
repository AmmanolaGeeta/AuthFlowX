import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';

/**
 * Regex for strong passwords:
 * - At least 8 characters
 * - One uppercase
 * - One lowercase
 * - One number
 */
export const strongPasswordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

/**
 * Custom validator: checks if two fields match
 */
export function passwordMatchValidator(passwordKey: string, confirmPasswordKey: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    if (!(group instanceof FormGroup)) {
      return null;
    }

    const password = group.controls[passwordKey];
    const confirmPassword = group.controls[confirmPasswordKey];

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value
      ? null
      : { passwordMismatch: true };
  };
}
