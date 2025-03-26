import { Component, OnInit, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { FieldsetModule } from 'primeng/fieldset';
import { ButtonModule } from 'primeng/button';
import { SettingsService } from '../../../core/settings/settings.service';
import { LISTAR_USUARIO, EDITAR_USUARIO } from '../../../shared/breadcrumb/breadcrumb';
import { BreadcrumbService } from '../../../shared/services/breadcrumb.service';
import { UserService } from '../users.service';

@Component({
  selector: 'app-user-edit',
  imports: [ReactiveFormsModule, ButtonModule, FieldsetModule],
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
      username: this._formBuilder.control('', Validators.required),
      names: this._formBuilder.control('', Validators.required),
      email: this._formBuilder.control('', Validators.required),
      password: this._formBuilder.control('', Validators.required),
      repeatPassword: this._formBuilder.control('', Validators.required),
      phone: this._formBuilder.control('', [])
    })
  }

  async onSubmit() {
    
  }
}
