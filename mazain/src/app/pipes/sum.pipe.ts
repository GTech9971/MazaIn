import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sum'
})
export class SumPipe implements PipeTransform {

  transform(list: number[]): number {
    return list.reduce((a, b) => { return a + b }, 0);
  }

}
