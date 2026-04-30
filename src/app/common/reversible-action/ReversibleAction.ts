import { type ReversibleActionType } from './ReversibleActionType.js';

export abstract class ReversibleAction<T> implements ReversibleActionType<T> {
  public dataStorage: T = {} as T;

  abstract apply(): void;
  abstract reverse(): void;

  static of<T>(template: ReversibleActionType<T>): ReversibleAction<T> {
    const action = ReversibleAction.from(template);
    window.ActiveProject.registerAction(action);
    action.apply();
    return action;
  }

  private static from<T>(args: ReversibleActionType<T>): ReversibleAction<T> {
    const dataStorage = args.dataStorage ? args.dataStorage : ({} as T);
    let apply, reverse;
    if (args.apply.length > 0) {
      apply = function () {
        args.apply(dataStorage);
      };
    } else {
      apply = args.apply;
    }
    if (args.reverse.length > 0) {
      reverse = function () {
        args.reverse(dataStorage);
      };
    } else {
      reverse = args.reverse;
    }
    return { dataStorage, apply, reverse } as ReversibleAction<T>;
  }
}
