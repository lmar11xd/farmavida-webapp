import { Pipe, PipeTransform } from '@angular/core';

//<td style="padding: 4px;">{{ product.name | replace: ' ': '*' }}</td>
@Pipe({
  name: 'replace'
})
export class ReplacePipe implements PipeTransform {
  transform(value: string, search: string | RegExp, replacement: string): string {
    if (!value) return '';
    return value.replace(new RegExp(search as string, 'g'), replacement);
  }
}

//<td style="padding: 4px;">{{ product.name | replaceSpaces }}</td>
@Pipe({ name: 'replaceSpaces' })
export class ReplaceSpacesPipe implements PipeTransform {
  transform(value: string): string {
    return value?.replace(/ /g, '\u00A0') ?? '';
  }
}
