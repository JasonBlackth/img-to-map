export interface ReversibleActionType<T> {
  dataStorage?: T;
  apply(data?: T): void;
  reverse(data?: T): void;
}
