import { getBrowserWindow, getDocument } from '@attachments/utils/browser';

/**
 * 当页面加载完触发- 创建一个宏任务并执行
 * @param callback 
 * @returns 
 */
export const onPageLoad = (callback: () => void) => {
    const window = getBrowserWindow();
    const document = getDocument();
    if (!window || !document) {
        return;
    }
    if (document.readyState === 'complete') {
        callback();
        return;
    }
    window.addEventListener(
        'load',
        () => {
            setTimeout(() => {
                callback();
            }, 0);
        },
        false,
    );
}