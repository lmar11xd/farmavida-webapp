import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../core/security/auth-service';
import { isRequired, hasEmailError } from '../../utils/validators';
import { FooterComponent } from "../../../shared/components/footer/footer.component";
import { SettingsService } from '../../../core/settings/settings.service';
import { LogoComponent } from "../../../shared/logo/logo.component";
import { MessageService } from 'primeng/api';

interface FormLogIn {
  username: FormControl<string | null>,
  password: FormControl<string | null>
}

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    FooterComponent,
    LogoComponent
],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export default class LoginComponent {
  form: FormGroup

  constructor(
    private _formBuilder: FormBuilder, 
    private _authService: AuthService, 
    private _router: Router,
    private _settings: SettingsService,
    private _messageService: MessageService
  ) {
    this.form = this._formBuilder.group<FormLogIn>(
      {
        username: this._formBuilder.control('', [Validators.required]),
        password: this._formBuilder.control('', [Validators.required])
      }
    )
  }

  isRequired(field: 'email' | 'password' | 'username') {
    return isRequired(field, this.form)
  }

  hasEmailError() {
    return hasEmailError(this.form)
  }

  async onSubmit() {
    if(this.form.invalid) return

    try {
      const { username, password } = this.form.value
      if(!username || !password) return
      this._settings.showSpinner()
  
      await this._authService.login({username, email: '', password})
      this._messageService.add({
        severity: 'info',
        summary: 'Farmavida',
        detail: 'Bienvenido a Farmavida',
        life: 3000
      });
      this._router.navigateByUrl('/dashboard')
    } catch (error: any) {
      this._messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error.toString().replace('Error: ', ''),
        life: 3000
      });
    } finally {
      this._settings.hideSpinner()
    }
  }
}
