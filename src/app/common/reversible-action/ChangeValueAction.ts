import { ReversibleAction } from './ReversibleAction.js';
import { AbstractEditor } from '../../editors/AbstractEditor.js';

export class ChangeValueAction<T> extends ReversibleAction<T> {
  private editor: AbstractEditor;
  private propertyName: string;
  private originalValue: T;
  private newValue: T;

  private constructor(editor: AbstractEditor, propertyName: string, originalValue: T, newValue: T) {
    super();
    this.editor = editor;
    this.propertyName = propertyName;
    this.originalValue = originalValue;
    this.newValue = newValue;
  }

  apply(): void {
    this.editor.setProperty(this.propertyName, this.newValue);
  }

  reverse(): void {
    this.editor.setProperty(this.propertyName, this.originalValue);
  }

  static for<T>(editor: AbstractEditor, propertyName: string, newValue: T): ChangeValueAction<T> {
    const originalValue = (editor as any)[propertyName];
    if (originalValue === newValue) {
      return null as any;
    }
    const action = new ChangeValueAction<T>(editor, propertyName, originalValue, newValue);
    action.apply();
    window.ActiveProject.registerAction(action);
    return action;
  }
}
