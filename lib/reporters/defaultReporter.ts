const ProgressBar = require('cli-progress');
const chalk = require('chalk') as any;

export default class DefaultReporter {
  progbar: any;

  constructor() {
    this.progbar = new ProgressBar.Bar({}, ProgressBar.Presets.shades_classic);

  }

  print(s: string): void {
    this.out(s);
  }

  printTitle(s: string): void {
    this.out(`===== ${s} =====`);
  }

  printInfo(s: string): void {
    this.out(chalk.dim(s));
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

  /* tslint:disable:no-console */
  out(s: string) {
    console.log(s);
  }
}
