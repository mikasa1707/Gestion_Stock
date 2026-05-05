import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decimalFormat',
  standalone: true,
})
export class DecimalFormatPipe implements PipeTransform {
  private decimalPipe = new DecimalPipe('fr-FR');

  transform(
    value: number | string | null | undefined,
    digitsInfo: string = '1.0-3',
    suffix: string = '',
  ): string {
    if (value === null || value === undefined || value === '') {
      return '-';
    }

    const numberValue = Number(value);

    if (Number.isNaN(numberValue)) {
      return '-';
    }

    const formatted = this.decimalPipe.transform(numberValue, digitsInfo);

    return suffix ? `${formatted} ${suffix}` : formatted ?? '-';
  }
}