import { type ReversibleActionType } from './ReversibleActionType.js';

export abstract class ReversibleAction<T> implements ReversibleActionType<T> {
  public dataStorage: T = {} as T;

  abstract apply(): void;
  abstract revert(): void;

  static of<T>(template: ReversibleActionType<T>): ReversibleAction<T> {
    const action = ReversibleAction.from(template);
    window.ActiveProject.registerAction(action);
    action.apply();
    return action;
  }

  private static from<T>(args: ReversibleActionType<T>): ReversibleAction<T> {
    const dataStorage = args.dataStorage ? args.dataStorage : ({} as T);
    let apply, revert;
    if (args.apply.length > 0) {
      apply = function () {
        args.apply(dataStorage);
      };
    } else {
      apply = args.apply;
    }
    if (args.revert.length > 0) {
      revert = function () {
        args.revert(dataStorage);
      };
    } else {
      revert = args.revert;
    }
    return { dataStorage, apply, revert } as ReversibleAction<T>;
  }
}
