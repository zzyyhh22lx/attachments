// 泛型定义事件处理函数的类型
type EventHandler<T = any> = (...args: T[]) => void;

// 定义事件映射的类型，每个事件对应一个事件处理函数数组
type EventMap = { [key: string]: Array<EventHandler> };

/**
 * eventbus
 */
export class EventEmitter {
  private events: EventMap = {};

  on<T = any>(event: string, fn: EventHandler<T>): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(fn as EventHandler);
  }
  emit<T = any>(event: string, ...args: T[]): void {
    const handlers = this.events[event];
    if (handlers) {
      handlers.forEach((fn) => fn(...args));
    }
  }

}
