let logging = true;

export function setLoggingEnabled(value: boolean) {
  logging = value;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function log(arg: any) {
  if (!logging) {
    return;
  }
  // eslint-disable-next-line no-console
  console.log(arg);
}
