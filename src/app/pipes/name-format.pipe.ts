import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nameFormat'
})
export class NameFormatPipe implements PipeTransform {

  /**
   * Capitalize the string
   * @param str The string to captitalyze
   */
  private capitalize(str: string): string {
    return str[0].toUpperCase() + str.slice(1);
  }

  transform(value: any, ...args: any[]): any {
    if (!value || !value.includes('.')) {
      return value;
    }
    const splitted = value.split('.');
    return `${this.capitalize(splitted[0])} ${this.capitalize(splitted[1])}`;
  }
}
