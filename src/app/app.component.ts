import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Event } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements AfterViewInit{
  public TrainerStates = TrainerStates;

  public rowsAmount = 5;
  public columnsAmount = 5;
  public squareSide = 100;
  public state = TrainerStates.setup;
  public numbers = new Array<number>(this.rowsAmount * this.columnsAmount);
  public currentNumber = 0;
  public time = 0;

  private _scrHeight!: number;
  private _scrWidth!: number;

  @ViewChild('squares') squaresElement!:ElementRef<HTMLDivElement>;

  @HostListener('window:resize', ['$event'])
  public getScreenSize() {
        this._scrHeight = window.innerHeight;
        this._scrWidth = window.innerWidth;
  }

  public ngAfterViewInit(): void {
    this.getScreenSize();
  }

  public handlePlay(): void {
    this.numbers = this._generateShuffledNumbers(this.rowsAmount * this.columnsAmount);
    this.state = TrainerStates.play;
    this.currentNumber = 1;

    {
      const els = this.squaresElement.nativeElement.getElementsByClassName('square--answered');
      Array.from(els).forEach(el => el.classList.remove('square--answered'));
    }

    this.time = Date.now();
  }

  public handleStop(): void {
    this._gameOver();
    this.time = 0;
  }

  public handleSquareSelection(selectedNumber: number, square: EventTarget | null): void {
    if (!selectedNumber || !square) return;
    if (this.currentNumber !== selectedNumber) return this.handleWrongSelection(square as HTMLDivElement);
    this.handleRightSelection(square as HTMLDivElement);
    this.currentNumber++;
    if (this.currentNumber > this.rowsAmount * this.columnsAmount) this._gameOver();
  }

  public handleRightSelection(square: HTMLDivElement): void {
    square.classList.add('square--right');
    setTimeout(((square: HTMLDivElement) => {
      square.classList.add('square--answered');
      square.classList.remove('square--right');
    }).bind(null, square), 300);
  }

  public handleWrongSelection(square: HTMLDivElement): void {
    square.classList.add('square--wrong');
    setTimeout(((square: HTMLDivElement) => {
      square.classList.remove('square--wrong');
    }).bind(null, square), 300);
  }

  private _generateShuffledNumbers(maxNumber: number): number[] {
    const result = new Array<number>();

    while(result.length < maxNumber) {
      const num = this._getRandomNumberInBoundaries(1, maxNumber);
      if(result.includes(num)) continue;
      result.push(num);
    }

    return result;
  }

  public handleControl(entityName: 'rowsAmount' | 'columnsAmount' | 'squareSide', action: 'increase' | 'decrease', amount = 1): void {
    switch(action) {
      case 'increase':
        { // validation
          const { width, height } = this.squaresElement.nativeElement.getBoundingClientRect();
          const maxWidth = this._scrWidth - 150;
          const maxHeight = this._scrHeight - 150;

          switch(entityName){
            case 'rowsAmount':
                if (height + this.squareSide * amount > maxHeight) return;
              break;
            
            case 'columnsAmount':
              if (width + this.squareSide * amount > maxWidth) return;
              break;

            case 'squareSide':
              if (width + this.columnsAmount * amount > maxWidth
                || height + this.rowsAmount * amount > maxHeight) return;
              break;

            default: return;
          }
        }

        this[entityName]+= amount;
        break;

      case 'decrease':
        if(this[entityName] <= amount) return;
        this[entityName]-= amount;
        break;

      default: break;
    }

    if (entityName === 'rowsAmount' || entityName === 'columnsAmount') {
      this.numbers = new Array<number>(this.rowsAmount * this.columnsAmount);
    }
  }

  /**
   * Get's random N value between two provided boundaries
   *
   * @param leftBound // 0 < leftBound < rightBound >> in N
   * @param rightBound // leftBound < rightBound < any >> in N
   */
  private _getRandomNumberInBoundaries(leftBound: number, rightBound: number): number {
    if (leftBound >= rightBound) throw new Error('Can not generate numbers');
    const coefficient = Math.random();
    const rangeLength = rightBound - leftBound;
    const numberPosition = Math.round(coefficient * rangeLength);
    return numberPosition + leftBound;
  }

  private _gameOver(): void {
    this.time = Date.now() - this.time;
    this.state = TrainerStates.setup;
  }
}

enum TrainerStates {
  setup = 'setup',
  play = 'play'
}
