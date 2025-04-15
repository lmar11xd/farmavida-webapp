import { environment } from './../../../../environments/environment';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styles: ``
})
export class FooterComponent {
  environment: string = environment.name == "dev" ? " - dev" : "";
}
