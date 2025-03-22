import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { hasConfirmPasswordError, hasEmailError, hasPasswordError, isRequired, passwordsMatchValidator } from '../../utils/validators';
import { AuthService } from '../../../core/security/auth-service';
import { toast } from 'ngx-sonner';
import { Router } from '@angular/router';
import { FooterComponent } from "../../../shared/components/footer/footer.component";
import { SettingsService } from '../../../core/settings/settings.service';

interface FormSignUp {
  email: FormControl<string | null>,
  password: FormControl<string | null>,
  confirmPassword: FormControl<string | null>
}

@Component({
  selector: 'app-signup',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    FooterComponent
],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export default class SignupComponent {
  form: FormGroup

  constructor(
    private _formBuilder: FormBuilder, 
    private _authService: AuthService, 
    private _router: Router,
    private _settings: SettingsService
  ) {
    this.form = this._formBuilder.group<FormSignUp>(
      {
        email: this._formBuilder.control('', [Validators.required, Validators.email]),
        password: this._formBuilder.control('', [Validators.required, Validators.minLength(6)]),
        confirmPassword: this._formBuilder.control('', [Validators.required, Validators.minLength(6)])
      }, 
      { validators: passwordsMatchValidator }
    )
  }

  isRequired(field: 'email' | 'password' | 'confirmPassword') {
    return isRequired(field, this.form)
  }

  hasEmailError() {
    return hasEmailError(this.form)
  }

  hasPasswordError() {
    return hasPasswordError(this.form)
  }

  hasConfirmPasswordError() {
    return hasConfirmPasswordError(this.form)
  }

  async onSubmit() {
    if(this.form.invalid) return

    try {
      const { email, password } = this.form.value
      if(!email || !password) return
      
      this._settings.showSpinner()
      await this._authService.signup({email, password})
      toast.success("Te has registrado correctamente")
      this._router.navigateByUrl('/dashboard')
    } catch (error) {
      toast.error("Ha ocurrido un error")
    } finally {
      this._settings.hideSpinner()
    }
  }
}
