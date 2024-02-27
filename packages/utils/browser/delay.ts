/**
 * 延迟 ${time} 时间
 * 
 * @author hylin
 * @param time 
 */
export const delay = (time: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, time));
};
