import { Action } from './Action.js';
import type { Editor } from './Editor.js';

export class ChangeValueAction<T> extends Action {
  private editor: Editor;
  private propertyName: string;
  private originalValue: T;
  private newValue: T;

  private constructor(editor: Editor, propertyName: string, originalValue: T, newValue: T) {
    super();
    this.editor = editor;
    this.propertyName = propertyName;
    this.originalValue = originalValue;
    this.newValue = newValue;
  }

  apply(): void {
    this.setEditorProperty(this.newValue);
  }

  revert(): void {
    this.setEditorProperty(this.originalValue);
  }

  static createAndChangeValue<T>(
    editor: Editor,
    propertyName: string,
    newValue: T,
  ): ChangeValueAction<T> {
    const originalValue = (editor as any)[propertyName];
    if (originalValue === newValue) {
      return null as any;
    }
    const action = new ChangeValueAction<T>(editor, propertyName, originalValue, newValue);
    action.apply();
    window.ActiveProject.registerAction(action);
    return action;
  }

  private setEditorProperty(to: T): void {
    (this.editor as any)[this.propertyName] = to;
    this.editor.handleValuesChanged();
  }
}
