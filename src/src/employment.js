export class Employment {
  constructor() {
    this.current = 0;

    this.views = [
      './employment1.html',
      './employment2.html',
      './employment3.html',
      './employment-review.html'
    ];

    this.max = this.views.length - 1;
  }

  next(step) {
    this.current += step;
  }
}
