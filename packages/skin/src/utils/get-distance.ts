import { ElementDistance } from '../types';

/**
  * 获取dom离页面左边上边的距离
  * @param {*} element dom元素
  * @returns 
  */
export const getElementDistance = (element: HTMLElement): ElementDistance => {
    const rect = element.getBoundingClientRect();
    const leftDistance = rect.left + window.pageXOffset;
    const topDistance = rect.top + window.pageYOffset;
    return {
        leftDistance, topDistance
    }
}
