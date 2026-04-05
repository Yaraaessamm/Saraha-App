import { EventEmitter } from "node:events";
import { eventName } from "./email.enum.js";

export const eventEmitter = new EventEmitter();

eventEmitter.on(eventName, async(fn) => {
    await fn();
});