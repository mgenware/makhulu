import Task from './task';
import IReporter from './reporter';

enum OperationType {
  Then = 1,
  MapSync,
  FilterSync,
  Print,
  SetReporter,
}

class Operation {
  constructor(public type: OperationType, public args: any[]) {
  }
}

export default class TaskFactory {
  private operations: Operation[] = [];

  constructor() { }

  then(description: string, callback: (array: any[]) => any[]): TaskFactory {
    this.addOperation(new Operation(OperationType.Then, [description, callback]));
    return this;
  }

  mapSync(description: string, callback: (data: any, index: number) => any): TaskFactory {
    this.addOperation(new Operation(OperationType.MapSync, [description, callback]));
    return this;
  }

  filterSync(description: string, callback: (data: any, index: number) => boolean): TaskFactory {
    this.addOperation(new Operation(OperationType.FilterSync, [description, callback]));
    return this;
  }

  print(): TaskFactory {
    this.addOperation(new Operation(OperationType.Print, []));
    return this;
  }

  runWithPromise(promise: Promise<any[]>) {
    this.startWithTask(Task.fromPromise(promise));
  }

  runWithArray(array: any[]) {
    this.startWithTask(Task.fromArray(array));
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

        case OperationType.MapSync:
        task.mapSync(op.args[0], op.args[1]);
        break;

        case OperationType.FilterSync:
        task.filterSync(op.args[0], op.args[1]);
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
