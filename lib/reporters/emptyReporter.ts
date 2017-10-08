/* tslint:disable:no-empty */
// A reporter that just ignores all messages
export default class EmptyReporter {
  constructor() { }

  print(_: string): void {
  }

  printTitle(_: string): void {
  }

  printInfo(_: string): void {
  }

  startProgress(_: number): void {
  }

  incrementProgress(_: number): void {
  }

  stopProgress(): void {
  }
}
