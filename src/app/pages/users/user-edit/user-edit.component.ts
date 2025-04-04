import { Component, OnInit, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { FieldsetModule } from 'primeng/fieldset';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SettingsService } from '../../../core/settings/settings.service';
import { LISTAR_USUARIO, EDITAR_USUARIO } from '../../../shared/breadcrumb/breadcrumb';
import { BreadcrumbService } from '../../../shared/services/breadcrumb.service';
import { UserService } from '../users.service';
import { User } from '../../../core/models/user';

@Component({
  selector: 'app-user-edit',
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, FieldsetModule],
  templateUrl: './user-edit.component.html',
  styles: ``
})
export default class UserEditComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  isLoading = signal(false)
  id: string | null = null

  constructor(
    private _formBuilder: FormBuilder,
    private _userService: UserService,
    private _router: Router,
    private _settings: SettingsService,
    private _breadcrumbService: BreadcrumbService,
    private _route: ActivatedRoute
  ) {
    this._route.queryParamMap.subscribe(params => {
      this.id = params.get('pkey');
    });
  }

  ngOnInit(): void {
    this.initializeBreadcrumb()
    this.initializeForm()
    this.initialize()
  }

  initializeBreadcrumb() {
    if(this.id != null) {
      EDITAR_USUARIO[0]?.url && (EDITAR_USUARIO[0].url = EDITAR_USUARIO[0].url.replace(':id', this.id));

      let BREADCRUMBS: MenuItem[] = [...LISTAR_USUARIO, ...EDITAR_USUARIO];

      this._breadcrumbService.addBreadcrumbs(BREADCRUMBS);
    }
  }

  initializeForm() {
    this.form = this._formBuilder.group({
      username: this._formBuilder.control({ value: '', disabled: true }, Validators.required),
      names: this._formBuilder.control('', Validators.required),
      email: this._formBuilder.control({ value: '', disabled: true }, Validators.required),
      phone: this._formBuilder.control('', [])
    })
  }

  initialize() {
    if(this.id != null) {
      this.getUser(this.id)
    }
  }

  async getUser(id: string) {
    this._settings.showSpinner()
    const userSnapshot = await this._userService.getUser(id)
    this._settings.hideSpinner()
    if(!userSnapshot.exists()) return
    const user = userSnapshot.data() as User
    this.form.patchValue(user)
  }

  async onSubmit() {
    if(this.form.invalid) return

    try {
      if(this.id != null) {
        const { names, phone } = this.form.getRawValue()

        this.isLoading.set(true)
        this._settings.showSpinner()

        await this._userService.updatePartial(this.id, names, phone)
        this._settings.showMessage('success', 'Guardar', 'Usuario actualizado correctamente');
        this._router.navigateByUrl('/user/list')
      }
    } catch (error) {
      console.error(error)
      this._settings.showMessage('error', 'Error', 'Error al actualizar usuario');
    } finally {
      this.isLoading.set(false)
      this._settings.hideSpinner()
    }
  }
}
