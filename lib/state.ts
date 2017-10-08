import Context from './context';

export default class State {
  context: Context;
  constructor(context: Context|null, public data: any) {
    this.context = context || new Context();
  }
}
