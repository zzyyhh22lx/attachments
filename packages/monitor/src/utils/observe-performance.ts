import { getPerformanceObserver } from '@attachments/utils/browser';
import type { destoryType } from '../types';

/**
 * 监听 performance 性能指标
 * 
 * https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceObserver
 * 
 * @param options 监听选项
 * @param callback 
 * @param once 是否只执行一次
 */
export const observerPerformance = (
    options: PerformanceObserverInit,
    callback: (entryList: PerformanceEntry[]) => void,
    once = false,
) => {
    let destory: destoryType;
    let isExecuted = false;
    
    const performanceObserver = getPerformanceObserver();
    if (performanceObserver) {
        const observerInstance = new PerformanceObserver((entryList) => {
            if (once && isExecuted) {
                return;
            }
            // 遍历【某小一段时间】收集到的性能条目
            const resourceEntries = entryList.getEntries();
            callback(resourceEntries);
        });
        observerInstance.observe(options);
        // 销毁
        destory = () => observerInstance.disconnect();
    }

    return destory;
}
