import { collection, Firestore, getDocs, query, where } from "@angular/fire/firestore";
import { AbstractControl, AsyncValidatorFn, FormGroup, ValidationErrors } from "@angular/forms";
import { of } from "rxjs";

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

export function usernameEmailValidator(firestore: Firestore): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) return of(null);
      
      const usersRef = collection(firestore, 'users');
      const q = query(usersRef, where(control.parent?.get('username') ? 'username' : 'email', '==', control.value));
  
      return getDocs(q).then(snapshot => {
        return snapshot.empty ? null : { alreadyTaken: true };
      }).catch(() => null);
    };
  }