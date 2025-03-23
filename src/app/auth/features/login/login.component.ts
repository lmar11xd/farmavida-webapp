import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { toast } from 'ngx-sonner';
import { AuthService } from '../../../core/security/auth-service';
import { isRequired, hasEmailError, hasPasswordError } from '../../utils/validators';
import { Router } from '@angular/router';
import { FooterComponent } from "../../../shared/components/footer/footer.component";
import { SettingsService } from '../../../core/settings/settings.service';
import { LogoComponent } from "../../../shared/logo/logo.component";

interface FormLogIn {
  email: FormControl<string | null>,
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
    private _settings: SettingsService
  ) {
    this.form = this._formBuilder.group<FormLogIn>(
      {
        email: this._formBuilder.control('', [Validators.required, Validators.email]),
        password: this._formBuilder.control('', [Validators.required, Validators.minLength(6)])
      }
    )
  }

  isRequired(field: 'email' | 'password') {
    return isRequired(field, this.form)
  }

  hasEmailError() {
    return hasEmailError(this.form)
  }

  hasPasswordError() {
    return hasPasswordError(this.form)
  }

  async onSubmit() {
    if(this.form.invalid) return

    try {
      const { email, password } = this.form.value
      if(!email || !password) return
      this._settings.showSpinner()
  
      await this._authService.login({email, password})
      toast.success("Bienvenido")
      this._router.navigateByUrl('/dashboard')
    } catch (error) {
      toast.error("Ha ocurrido un error")
    } finally {
      this._settings.hideSpinner()
    }
  }
}
