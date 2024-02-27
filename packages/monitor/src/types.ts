/** 销毁函数 */
export type destoryType = (() => void) | undefined;
/** 监听函数 */
export type ListenerType = {
    destory: destoryType;
}

export enum EventType {
    FETCH = 'FETCH',
    XHR = 'XHR',
    JS_ERROR = 'JS_ERROR',
    ASSETS = 'ASSETS',
    ASSETS_ERROR = 'ASSETS_ERROR',
    PAINT = 'PAINT',
    LARGEST_CONTENTFUL_PAINT = 'LARGEST_CONTENTFUL_PAINT',
    CUMULATIVE_LAYOUT_SHIFT = 'CUMULATIVE_LAYOUT_SHIFT',
    TTI = 'TTI',
    MPFID = 'MPFID',
    FID = 'FID',
    COMMON_PERFORMANCE_TIMING = 'COMMON_PERFORMANCE_TIMING',
    FMP = 'FMP',
}