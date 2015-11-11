import {raf} from './dom';

/**
 * FastDom
 *
 * Eliminates layout thrashing
 * by batching DOM read/write
 * interactions.
 *
 * @author Wilson Page <wilsonpage@me.com>
 */

/**
 * Creates a fresh
 * FastDom instance.
 *
 * @constructor
 */
export function FastDom() {
  this.frames = [];
  this.lastId = 0;

  // Placing the rAF method
  // on the instance allows
  // us to replace it with
  // a stub for testing.
  this.raf = raf;

  this.batch = {
    hash: {},
    read: [],
    write: [],
    mode: null
  };
}

/**
 * Adds a job to the
 * read batch and schedules
 * a new frame if need be.
 *
 * @param  {Function} fn
 * @public
 */
FastDom.prototype.read = function(fn, ctx) {
  var job = this.add('read', fn, ctx);
  var id = job.id;

  // Add this job to the read queue
  this.batch.read.push(job.id);

  // We should *not* schedule a new frame if:
  // 1. We're 'reading'
  // 2. A frame is already scheduled
  var doesntNeedFrame = this.batch.mode === 'reading'
    || this.batch.scheduled;

  // If a frame isn't needed, return
  if (doesntNeedFrame) return id;

  // Schedule a new
  // frame, then return
  this.scheduleBatch();
  return id;
};

/**
 * Adds a job to the
 * write batch and schedules
 * a new frame if need be.
 *
 * @param  {Function} fn
 * @public
 */
FastDom.prototype.write = function(fn, ctx) {
  var job = this.add('write', fn, ctx);
  var mode = this.batch.mode;
  var id = job.id;

  // Push the job id into the queue
  this.batch.write.push(job.id);

  // We should *not* schedule a new frame if:
  // 1. We are 'writing'
  // 2. We are 'reading'
  // 3. A frame is already scheduled.
  var doesntNeedFrame = mode === 'writing'
    || mode === 'reading'
    || this.batch.scheduled;

  // If a frame isn't needed, return
  if (doesntNeedFrame) return id;

  // Schedule a new
  // frame, then return
  this.scheduleBatch();
  return id;
};

/**
 * Defers the given job
 * by the number of frames
 * specified.
 *
 * If no frames are given
 * then the job is run in
 * the next free frame.
 *
 * @param  {Number}   frame
 * @param  {Function} fn
 * @public
 */
FastDom.prototype.defer = function(frame, fn, ctx) {

  // Accepts two arguments
  if (typeof frame === 'function') {
    ctx = fn;
    fn = frame;
    frame = 1;
  }

  var self = this;
  var index = frame - 1;

  return this.schedule(index, function() {
    self.run({
      fn: fn,
      ctx: ctx
    });
  });
};

/**
 * Clears a scheduled 'read',
 * 'write' or 'defer' job.
 *
 * @param  {Number|String} id
 * @public
 */
FastDom.prototype.clear = function(id) {

  // Defer jobs are cleared differently
  if (typeof id === 'function') {
    return this.clearFrame(id);
  }

  // Allow ids to be passed as strings
  id = Number(id);

  var job = this.batch.hash[id];
  if (!job) return;

  var list = this.batch[job.type];
  var index = list.indexOf(id);

  // Clear references
  delete this.batch.hash[id];
  if (~index) list.splice(index, 1);
};

/**
 * Clears a scheduled frame.
 *
 * @param  {Function} frame
 * @private
 */
FastDom.prototype.clearFrame = function(frame) {
  var index = this.frames.indexOf(frame);
  if (~index) this.frames.splice(index, 1);
};

/**
 * Schedules a new read/write
 * batch if one isn't pending.
 *
 * @private
 */
FastDom.prototype.scheduleBatch = function() {
  var self = this;

  // Schedule batch for next frame
  this.schedule(0, function() {
    self.batch.scheduled = false;
    self.runBatch();
  });

  // Set flag to indicate
  // a frame has been scheduled
  this.batch.scheduled = true;
};

/**
 * Generates a unique
 * id for a job.
 *
 * @return {Number}
 * @private
 */
FastDom.prototype.uniqueId = function() {
  return ++this.lastId;
};

/**
 * Calls each job in
 * the list passed.
 *
 * If a context has been
 * stored on the function
 * then it is used, else the
 * current `this` is used.
 *
 * @param  {Array} list
 * @private
 */
FastDom.prototype.flush = function(list) {
  var id;

  while (id = list.shift()) {
    this.run(this.batch.hash[id]);
  }
};

/**
 * Runs any 'read' jobs followed
 * by any 'write' jobs.
 *
 * We run this inside a try catch
 * so that if any jobs error, we
 * are able to recover and continue
 * to flush the batch until it's empty.
 *
 * @private
 */
FastDom.prototype.runBatch = function() {
  try {

    // Set the mode to 'reading',
    // then empty all read jobs
    this.batch.mode = 'reading';
    this.flush(this.batch.read);

    // Set the mode to 'writing'
    // then empty all write jobs
    this.batch.mode = 'writing';
    this.flush(this.batch.write);

    this.batch.mode = null;

  } catch (e) {
    this.runBatch();
    throw e;
  }
};

/**
 * Adds a new job to
 * the given batch.
 *
 * @param {Array}   list
 * @param {Function} fn
 * @param {Object}   ctx
 * @returns {Number} id
 * @private
 */
FastDom.prototype.add = function(type, fn, ctx) {
  var id = this.uniqueId();
  return this.batch.hash[id] = {
    id: id,
    fn: fn,
    ctx: ctx,
    type: type
  };
};

/**
 * Runs a given job.
 *
 * Applications using FastDom
 * have the options of setting
 * `fastdom.onError`.
 *
 * This will catch any
 * errors that may throw
 * inside callbacks, which
 * is useful as often DOM
 * nodes have been removed
 * since a job was scheduled.
 *
 * Example:
 *
 *   fastdom.onError = function(e) {
 *     // Runs when jobs error
 *   };
 *
 * @param  {Object} job
 * @private
 */
FastDom.prototype.run = function(job){
  var ctx = job.ctx || this;
  var fn = job.fn;

  // Clear reference to the job
  delete this.batch.hash[job.id];

  // If no `onError` handler
  // has been registered, just
  // run the job normally.
  if (!this.onError) {
    return fn.call(ctx);
  }

  // If an `onError` handler
  // has been registered, catch
  // errors that throw inside
  // callbacks, and run the
  // handler instead.
  try { fn.call(ctx); } catch (e) {
    this.onError(e);
  }
};

/**
 * Starts a rAF loop
 * to empty the frame queue.
 *
 * @private
 */
FastDom.prototype.loop = function() {
  var self = this;
  var raf = this.raf;

  // Don't start more than one loop
  if (this.looping) return;

  raf(function frame() {
    var fn = self.frames.shift();

    // If no more frames,
    // stop looping
    if (!self.frames.length) {
      self.looping = false;

    // Otherwise, schedule the
    // next frame
    } else {
      raf(frame);
    }

    // Run the frame.  Note that
    // this may throw an error
    // in user code, but all
    // fastdom tasks are dealt
    // with already so the code
    // will continue to iterate
    if (fn) fn();
  });

  this.looping = true;
};

/**
 * Adds a function to
 * a specified index
 * of the frame queue.
 *
 * @param  {Number}   index
 * @param  {Function} fn
 * @return {Function}
 * @private
 */
FastDom.prototype.schedule = function(index, fn) {

  // Make sure this slot
  // hasn't already been
  // taken. If it has, try
  // re-scheduling for the next slot
  if (this.frames[index]) {
    return this.schedule(index + 1, fn);
  }

  // Start the rAF
  // loop to empty
  // the frame queue
  this.loop();

  // Insert this function into
  // the frames queue and return
  return this.frames[index] = fn;
};
