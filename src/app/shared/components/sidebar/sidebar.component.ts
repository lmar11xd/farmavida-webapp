import { Component, input, Input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStateService } from '../../services/auth.state.service';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink, RouterLinkActive
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  visible = input.required<boolean>()
  
  constructor(private _authState: AuthStateService, private _router: Router) {}

  async logout() {
    await this._authState.logout()
    this._router.navigateByUrl('/auth/login')
  }
}
