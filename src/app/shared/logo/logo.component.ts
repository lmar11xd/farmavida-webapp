import { Component } from '@angular/core';
import { appVersion } from '../../../version'; //Compilar: npm run build

@Component({
  selector: 'app-logo',
  imports: [],
  templateUrl: './logo.component.html',
  styles: ``
})
export class LogoComponent {
  appVersion = appVersion; // Version from version.js file
}
