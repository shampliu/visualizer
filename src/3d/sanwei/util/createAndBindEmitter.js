import EventEmitter from "eventemitter3";

export const createAndBindEmitter = (scope) => {
  const emitter = new EventEmitter();
  scope.emit = emitter.emit.bind(emitter);
  scope.on = emitter.on.bind(emitter);
  scope.once = emitter.once.bind(emitter);

  return scope;
};
