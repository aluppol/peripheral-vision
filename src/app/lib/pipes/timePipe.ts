import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: 'msToTime'})
export class MsToTimePipe implements PipeTransform {
  transform(ms: number): string {
    if (!ms) return '';
    if (ms > (59 * 1000 + 59 * 60 * 1000 + 24 * 60 * 60 * 1000)) return '23:59:59 <';
    let time = Math.floor(ms / 1000);

    const seconds = time % 60;
    time = Math.floor(time / 60);

    const minutes = time % 60;
    time = Math.floor(time / 60);

    const hours = time % 60;

    return `${('0' + hours).slice(-2)}:${('0' + minutes).slice(-2)}:${('0' + seconds).slice(-2)}`;
  }
}
