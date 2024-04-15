type FuncType = () => void;
class EventEmitter {
    events: Record<string, Set<FuncType>>
    constructor() {
        this.events = {};
    };
    on(eventName: string, callback: FuncType) {
        if (!this.events[eventName]) {
            this.events[eventName] = new Set();
        };
        this.events[eventName].add(callback);
    };
    emit(eventName: string) {
        this.events[eventName].forEach(func => func());
    };
    removeListener(eventName: string, callback: FuncType) {
        this.events[eventName].delete(callback);
    };
}
const Emitter = new EventEmitter()

function callback() {
    console.log('触发了event事件1！');
}
function callback2() {
    console.log('触发了event事件2！');
}
Emitter.on('event', callback);
Emitter.on('event', callback);
Emitter.on('event', callback2);
Emitter.emit('event');
Emitter.removeListener('event', callback);
Emitter.emit('event');
