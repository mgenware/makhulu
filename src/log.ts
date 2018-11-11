let logging = true;

export function setLoggingEnabled(value: boolean) {
  logging = value;
}

export default function log(msg: string) {
  if (!logging) {
    return;
  }
  // tslint:disable-next-line no-console
  console.log(msg);
}
