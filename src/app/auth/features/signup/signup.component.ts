import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { hasConfirmPasswordError, hasEmailError, hasPasswordError, isRequired, passwordsMatchValidator } from '../../utils/validators';
import { AuthService } from '../../../core/security/auth-service';
import { FooterComponent } from "../../../shared/components/footer/footer.component";
import { SettingsService } from '../../../core/settings/settings.service';
import { LogoComponent } from "../../../shared/logo/logo.component";

interface FormSignUp {
  username: FormControl<string | null>,
  email: FormControl<string | null>,
  password: FormControl<string | null>,
  confirmPassword: FormControl<string | null>
}

@Component({
  selector: 'app-signup',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    FooterComponent,
    LogoComponent
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
    private _settings: SettingsService,
    private _messageService: MessageService
  ) {
    this.form = this._formBuilder.group<FormSignUp>(
      {
        username: this._formBuilder.control('', [Validators.required]),
        email: this._formBuilder.control('', [Validators.required, Validators.email]),
        password: this._formBuilder.control('', [Validators.required, Validators.minLength(6)]),
        confirmPassword: this._formBuilder.control('', [Validators.required, Validators.minLength(6)])
      }, 
      { validators: passwordsMatchValidator }
    )
  }

  isRequired(field: 'email' | 'password' | 'confirmPassword' | 'username') {
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
      const { username, email, password } = this.form.value
      if(!email || !password) return
      
      this._settings.showSpinner()
      await this._authService.signup({username, email, password})
      this._messageService.add({
        severity: 'info',
        summary: 'Farmavida',
        detail: 'Bienvenido a Farmavida',
        life: 3000
      });
      this._router.navigateByUrl('/dashboard')
    } catch (error) {
      this._messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al registrar usuario',
        life: 3000
      });
    } finally {
      this._settings.hideSpinner()
    }
  }
}
