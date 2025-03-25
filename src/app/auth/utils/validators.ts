import { AbstractControl, FormGroup, ValidationErrors } from "@angular/forms";

export const isRequired = (field: 'email' | 'password' | 'confirmPassword' | 'username' | 'names', form: FormGroup) => {
    const control = form.get(field)
    return control && control.touched && control.hasError('required')
}

export const hasPasswordError = (form: FormGroup) => {
    const control = form.get('password')
    return control && control.touched && control.hasError('minlength')
}

export const hasConfirmPasswordError = (form: FormGroup) => {
    const control = form.get('confirmPassword')
    return control && control.touched && form.hasError('mismatch')
}

export const hasEmailError = (form: FormGroup) => {
    const control = form.get('email')
    return control && control.touched && control.hasError('email')
}

export function passwordsMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
}