import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { FieldsetModule } from 'primeng/fieldset';
import { SettingsService } from '../../../core/settings/settings.service';
import { LISTAR_USUARIO, CREAR_USUARIO } from '../../../shared/breadcrumb/breadcrumb';
import { BreadcrumbService } from '../../../shared/services/breadcrumb.service';
import { UserCreate, UserService } from '../users.service';
import { UserRolEnum } from '../../../core/enums/user-rol.enum';
import { hasConfirmPasswordError, hasEmailError, hasPasswordError, isRequired } from '../../../auth/utils/validators';
import CryptoJS from 'crypto-js';
import { AES_SECRET_KEY } from '../../../core/constants/constants';

@Component({
  selector: 'app-user-create',
  imports: [ReactiveFormsModule, ButtonModule, ToastModule, FieldsetModule, MessageModule],
  templateUrl: './user-create.component.html',
  styles: ``
})
export default class UserCreateComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  isLoading = signal(false)
  
  constructor(
    private _formBuilder: FormBuilder, 
    private _userService: UserService, 
    private _router: Router,
    private _settings: SettingsService,
    private _breadcrumbService: BreadcrumbService,
    private _messageService: MessageService
  ) {}
  
  ngOnInit(): void {
    this.initializeBreadcrumb()
    this.initializeForm()
  }

  initializeBreadcrumb() {
    let BREADCRUMBS: MenuItem[] = [...LISTAR_USUARIO, ...CREAR_USUARIO];

    this._breadcrumbService.addBreadcrumbs(BREADCRUMBS);
  }

  initializeForm() {
    this.form = this._formBuilder.group({
      username: this._formBuilder.control('', Validators.required),
      names: this._formBuilder.control('', Validators.required),
      email: this._formBuilder.control('', Validators.required),
      password: this._formBuilder.control('', Validators.required),
      confirmPassword: this._formBuilder.control('', Validators.required),
      phone: this._formBuilder.control('', [])
    })
  }

  isRequired(field: 'email' | 'password' | 'confirmPassword' | 'username' | 'names') {
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
      const { username, names, email, password, phone } = this.form.value
      if(!email || !password) return

      this.isLoading.set(true)
      this._settings.showSpinner()

      const hashedPassword = CryptoJS.AES.encrypt(password, AES_SECRET_KEY).toString()

      const user: UserCreate = ({
        username: username || '',
        names: names || '',
        email: email || '',
        password: hashedPassword || '',
        phone: phone || '',
        role: UserRolEnum.VENDEDOR
      })

      await this._userService.createUser(user)
      this._messageService.add({
        severity: 'success',
        summary: 'Guardar',
        detail: 'Usuario creado correctamente',
        life: 3000
      });
      this._router.navigateByUrl('/user/list')
    } catch (error) {
      this._messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al crear usuario',
        life: 3000
      });
    } finally {
      this.isLoading.set(false)
      this._settings.hideSpinner()
    }
  }

}
