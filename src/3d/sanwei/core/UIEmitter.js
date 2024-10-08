import { createAndBindEmitter } from "../util/createAndBindEmitter";

class UIEmitterBase {
  constructor() {
    createAndBindEmitter(this);
  }
}

export const UIEmitter = new UIEmitterBase();
