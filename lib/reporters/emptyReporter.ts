/* tslint:disable:no-empty */
// A reporter that just ignores all messages
export default class EmptyReporter {
  constructor() { }

  print(s: string): void {
  }

  printTitle(s: string): void {
  }

  printInfo(s: string): void {
  }

  startProgress(max: number): void {
  }

  incrementProgress(value: number): void {
  }

  stopProgress(): void {
  }
}
