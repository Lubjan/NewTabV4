import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'size',
})
export class SizePipe implements PipeTransform {
  transform(value: string, width: number, height: number): string {
    return value.replace(/\{width\}/gim, String(width)).replace(/\{height\}/gim, String(height));
  }
}
