"use client";

export interface Store<T> {
  subscribe: (onStoreChange: () => void) => () => void;
  getSnapshot: () => T;
  getServerSnapshot: () => T;
  emit: () => void;
}

export function createStore<T>(config: {
  eventName: string;
  read: () => T;
  serverValue: T;
}): Store<T> {
  return {
    subscribe(onStoreChange) {
      const handleChange = () => onStoreChange();
      window.addEventListener(config.eventName, handleChange);
      window.addEventListener("storage", handleChange);
      return () => {
        window.removeEventListener(config.eventName, handleChange);
        window.removeEventListener("storage", handleChange);
      };
    },
    getSnapshot: config.read,
    getServerSnapshot: () => config.serverValue,
    emit() {
      window.dispatchEvent(new Event(config.eventName));
    },
  };
}
