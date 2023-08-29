/**
 * Creates a lock controller.
 *
 * Claiming a lock means that nothing else can aquire the lock until it is released.
 * This can momentarily prevent execution of code that needs to wait for the earlier code to finish.
 * For example, this can be used to prevent multiple transitions from occurring at the same time.
 */
export const createLockController = () => {
  let waitPromise: Promise<void>;

  /**
   * When lock() is called, the lock is claimed.
   * Once a lock has been claimed, it cannot be claimed again until it is released.
   * When this function gets resolved, the lock is released, allowing it to be claimed again.
   *
   * @example ```tsx
   * const unlock = await this.lockController.lock();
   * // do other stuff
   * unlock();
   * ```
   */
  const lock = async () => {
    const p = waitPromise;
    let resolve!: () => void;
    waitPromise = new Promise((r) => (resolve = r));
    if (p !== undefined) {
      await p;
    }
    return resolve;
  };

  return {
    lock,
  };
};
