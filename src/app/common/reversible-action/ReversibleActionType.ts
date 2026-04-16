export interface ReversibleActionType<T> {
  dataStorage?: T;
  apply(data?: T): void;
  revert(data?: T): void;
}
