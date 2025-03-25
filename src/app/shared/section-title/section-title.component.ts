import { Component, input } from '@angular/core';

@Component({
  selector: 'app-section-title',
  imports: [],
  templateUrl: './section-title.component.html',
  styles: ``
})
export class SectionTitleComponent {
  title = input.required()
}
