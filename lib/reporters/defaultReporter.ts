const ProgressBar = require('cli-progress');

export default class DefaultReporter {
  progbar: any;

  constructor() {
    this.progbar = new ProgressBar.Bar({}, ProgressBar.Presets.shades_classic);

  }

  print(s: string): void {
    console.log(s);
  }

  startProgress(max: number): void {
    this.progbar.start(max, 0);
  }

  incrementProgress(value: number): void {
    this.progbar.increament(value);
  }

  stopProgress(): void {
    this.progbar.stop();
  }
}
