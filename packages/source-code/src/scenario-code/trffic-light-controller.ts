type TrafficColorType = 'red' | 'green' | 'yellow';
type StateType = {type: TrafficColorType, duration: number};

/**
    请实现信号灯控制类 TrafficLightController，要求:
    调用该类的 start()方法后，信号灯以绿灯 30s、黄灯 3s、红灯 20s 往复切换。
    调用该类的 changeDuration(color, duration)方法后，可修改各种颜色的持续时长，修改在下一次切换该颜色时生效。
    调用该类的 stop()方法后，信号灯切换停止，且停留在当前状态，在控制台打印信号灯状态即可，不需要实现界面。
    可以使用 Promise、async、await.
 */
export class TrafficLightController {
    private states: StateType[];
    private index: number;
    /** 是否中断 */
    private isAbort: boolean;
    constructor() {
        this.index = 0;
        this.states = [
            { type: 'red', duration: 30 },
            { type: 'yellow', duration: 3 },
            { type: 'green', duration: 20 }
        ];
        this.isAbort = false;
    };
    delay(time: number): Promise<void> {
        return new Promise(res => {
            setTimeout(() => {
                if (this.isAbort) return {};
                res();
            }, time);
        })
    };
    /**
     * 
     * @param isReset 是否重新启动
     */
    async start(isReset: boolean = true) {
        if (isReset) this.isAbort = false;
        const state = this.states[this.index];
        await this.delay(state.duration);
        console.log(state);
        this.index = (this.index + 1) % 3;
        this.start(false);
    };
    stop() {
        this.isAbort = true;
    };
    changeDuration(color: TrafficColorType, duration: number): void {
        this.states.forEach(state => {
            if (state.type === color) state.duration = duration;
        });
    };
}

const traffic = new TrafficLightController();
traffic.start();
setTimeout(() => {
    traffic.changeDuration('yellow', 2000);
}, 2000);
setTimeout(() => {
    traffic.stop();
}, 4000);
// { type: 'red', duration: 3000 }