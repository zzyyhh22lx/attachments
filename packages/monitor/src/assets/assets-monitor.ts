import { onPageLoad } from '../utils/on-page-load';
import { PERFORMANCE_ENTRY_TYPES } from '../constants';
import { observerPerformance } from '../utils/observe-performance';
import type { ListenerType, destoryType } from '../types';
/**
 * 前端监控-静态资源
 * 
 */
export const createAssetsMonitor = (): ListenerType => {
    const observerOptions: PerformanceObserverInit = {
        entryTypes: [PERFORMANCE_ENTRY_TYPES.RESOURCE],
    };
    let destory: destoryType;
    
    const report = (entryList: PerformanceEntry[]) => {
        entryList.forEach((entry) => {
            console.log(entry);
        });
    }

    /**
     * 对于 onload 之前的内容，在 onload 回调开始时直接使用 performance.getEntriesByType 获取
     * onload 事件会在 DOM 和所有的资源加载完成后触发，直接开启监听器必然会影响首屏性能
     *  */
    onPageLoad(() => {
        report(performance.getEntriesByType(PERFORMANCE_ENTRY_TYPES.RESOURCE));
        destory = observerPerformance(observerOptions, (entryList) => {
            report(entryList);
        });
    })
    return {
        destory,
    }
}
