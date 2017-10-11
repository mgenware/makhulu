import Task from './task';
import State from './state';
import IReporter from './reporter';

enum OperationType {
  Then = 1,
  Map,
  Filter,
  Print,
  SetReporter,
}

class Operation {
  constructor(public type: OperationType, public args: any[]) {
  }
}

export default class TaskFactory {
  private operations: Operation[] = [];

  then(description: string, callback: (states: State[]) => any): TaskFactory {
    this.addOperation(new Operation(OperationType.Then, [description, callback]));
    return this;
  }

  map(description: string, callback: (current: any, state: State, index: number) => any): TaskFactory {
    this.addOperation(new Operation(OperationType.Map, [description, callback]));
    return this;
  }

  filter(description: string, callback: (current: any, state: State, index: number) => boolean): TaskFactory {
    this.addOperation(new Operation(OperationType.Filter, [description, callback]));
    return this;
  }

  print(): TaskFactory {
    this.addOperation(new Operation(OperationType.Print, []));
    return this;
  }

  runWithStates(states: State[]) {
    this.startWithTask(Task.fromInitialStates(states));
  }

  runWithPromise(promise: Promise<any>) {
    this.startWithTask(Task.fromPromise(promise));
  }

  setReporter(rep: IReporter|null) {
    this.addOperation(new Operation(OperationType.SetReporter, [rep]));
  }

  private startWithTask(task: Task) {
    for (const op of this.operations) {
      switch (op.type) {
        case OperationType.Then:
        task.then(op.args[0], op.args[1]);
        break;

        case OperationType.Map:
        task.map(op.args[0], op.args[1]);
        break;

        case OperationType.Filter:
        task.filter(op.args[0], op.args[1]);
        break;

        case OperationType.Print:
        task.print();
        break;

        case OperationType.SetReporter:
        task.setReporter(op.args[0]);
        break;
      }
    }
  }

  private addOperation(oper: Operation) {
    this.operations.push(oper);
  }
}
