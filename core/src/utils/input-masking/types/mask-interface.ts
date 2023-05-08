export interface TypedInputEvent extends InputEvent {
  inputType:
    | 'deleteByCut' // Ctrl (Command) + X
    | 'deleteContentBackward' // Backspace
    | 'deleteContentForward' // Delete (Fn + Backspace)
    | 'deleteHardLineBackward' // Ctrl (Command) + Backspace
    | 'deleteHardLineForward'
    | 'deleteSoftLineBackward' // Ctrl (Command) + Backspace
    | 'deleteSoftLineForward'
    | 'deleteWordBackward' // Alt (Option) + Backspace
    | 'deleteWordForward' // Alt (Option) + Delete (Fn + Backspace)
    | 'historyRedo' // Ctrl (Command) + Shift + Z
    | 'historyUndo' // Ctrl (Command) + Z
    | 'insertCompositionText'
    | 'insertFromDrop'
    | 'insertFromPaste' // Ctrl (Command) + V
    | 'insertLineBreak'
    | 'insertReplacementText'
    | 'insertText';
}

export type SelectionRange = [from: number, to: number];

export interface ElementState {
  readonly value: string;
  readonly selection: SelectionRange;
}

export type MaskExpression = (RegExp | string)[] | RegExp;

export type MaskPreprocessor = (
  _: {
    elementState: ElementState;
    data: string;
  },
  actionType: 'deleteBackward' | 'deleteForward' | 'insert' | 'validation'
) => {
  elementState: ElementState;
  data?: string;
};

export type MaskPostprocessor = (elementState: ElementState, initialElementState: ElementState) => ElementState;

export interface MaskOptions {
  readonly mask: MaskExpression | ((elementState: ElementState) => MaskExpression);
  /**
   * @internal
   */
  readonly preprocessor?: MaskPreprocessor;
  /**
   * @internal
   */
  readonly postprocessor?: MaskPostprocessor;
  /**
   * @internal
   */
  readonly overwriteMode?: 'replace' | 'shift' | ((elementState: ElementState) => 'replace' | 'shift');
}

export type MaskVisibility = 'always' | 'focus' | 'never';

export type MaskPlaceholder = string | null | undefined;
