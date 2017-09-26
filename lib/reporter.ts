export default interface IReporter {
  print(s: string): void;
  printTitle(s: string): void;
  printInfo(s: string): void;

  startProgress(max: number): void;
  incrementProgress(value: number): void;
  stopProgress(): void;
}
