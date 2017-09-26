const ProgressBar = require('cli-progress');
const chalk = require('chalk') as any;

export default class DefaultReporter {
  progbar: any;

  constructor() {
    this.progbar = new ProgressBar.Bar({}, ProgressBar.Presets.shades_classic);

  }

  print(s: string): void {
    console.log(s);
  }

  printTitle(s: string): void {
    console.log(`===== ${s} =====`);
  }

  printInfo(s: string): void {
    console.log(chalk.dim(s));
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
