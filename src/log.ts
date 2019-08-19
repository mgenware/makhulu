let logging = true;

export function setLoggingEnabled(value: boolean) {
  logging = value;
}

// tslint:disable-next-line no-any
export default function log(arg: any) {
  if (!logging) {
    return;
  }
  // tslint:disable-next-line no-console
  console.log(arg);
}
