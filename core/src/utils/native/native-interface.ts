/**
 * Used to represent a generic error from a native plugin call.
 */
export interface NativePluginError {
  /**
   * The error code.
   */
  code?: string;
  /**
   * The error message.
   */
  message?: string;
}
