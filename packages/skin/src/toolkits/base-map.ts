import type { ElementOptions, Position, AreaType } from '../types';
import { Point, Area } from '../base';
import { DefaultStyleVal } from '../types';
import { isAllBzPointInPath } from '../utils/geometry-utils';
import { deepClone, debounce } from '../utils';
/**
 * 可基于此Map进行扩展
 * 
 * 此对象仅支持绘制，没有任何事件
 */
export class BaseMap {
    width: number;
    height: number;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    /** 克隆的canvas元素 */
    clone_canvas: HTMLCanvasElement;
    clone_ctx: CanvasRenderingContext2D;
    img: HTMLImageElement;
    /** 区域信息 */
    areas: Area[];
    /** 历史记录 */
    history: ImageData[];
    /** ctx记录 */
    ctxs: CanvasRenderingContext2D[];
    /** 移动的时候添加history(加一个防抖) */
    addHistory: () => {};
    /**
     * 
     * @param canvas 
     * @param elementOptions 
     */
    constructor(canvas: HTMLCanvasElement, elementOptions: ElementOptions) {
        this.width = elementOptions.width;
        this.height = elementOptions.height;

        this.canvas = canvas;
        this.canvas.width = elementOptions.width;
        this.canvas.height = elementOptions.height;
        this.ctx = canvas.getContext("2d", { willReadFrequently: true })!;

        // 克隆canvas，方便原图切割图片
        this.clone_canvas = document.createElement("canvas");
        this.clone_canvas.width = elementOptions.width;
        this.clone_canvas.height = elementOptions.height;
        this.clone_ctx = this.clone_canvas.getContext("2d", { willReadFrequently: true })!;

        this.areas = [];
        this.history = [];
        this.ctxs = [];

        this.addHistory = debounce(() => {
            this.history.push(deepClone(this.areas));
        }, 200);

        this.img = new Image();
        this.img.src = elementOptions.src;
        this.img.crossOrigin = "anonymous";

        this.img.onload = () => {
            this.drawImg(this.ctx, this.img, this.canvas);
            this.drawImg(this.clone_ctx, this.img, this.clone_canvas);
            const imageData = this.ctx.getImageData(0, 0, this.width, this.height);
            this.history.push(imageData);
        };
    }



    /**
     * 清空画布，画背景图图
     * @param ctx 
     * @param img 
     * @param canvas 
     */
    drawImg(ctx: CanvasRenderingContext2D, img: HTMLImageElement, canvas: HTMLCanvasElement) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.shadowBlur = 0;
        ctx.shadowColor = DefaultStyleVal.shadow_color;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.globalAlpha = 1;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }

    /**
     * 画当前区域所有的点
     * @param {*} ctx 
     * @param {*} area 
     */
    drawPoint(ctx: CanvasRenderingContext2D, area: AreaType) {
        const { points } = area;
        ctx.save();
        points.forEach(p => {
            ctx.moveTo(p.x, p.y);
            ctx.globalAlpha = 0.85;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2);
            ctx.closePath();
            ctx.fillStyle = p.color;
            ctx.strokeStyle = DefaultStyleVal.stroke_style;
            ctx.fill();
        })
        ctx.restore();
    }

    /**
     * 画当前区域的所有的线
     * @param {*} ctx 
     * @param {*} area 
     */
    drawLine(ctx: CanvasRenderingContext2D, area: AreaType) {
        const { points } = area;
        points.forEach((p, i) => {
            if (i === 0) {
                ctx.moveTo(p.x, p.y)
            } else {
                ctx.lineTo(p.x, p.y)
            }
        })
        ctx.lineWidth = DefaultStyleVal.line_width;
        ctx.strokeStyle = DefaultStyleVal.line_stroke_style;
        ctx.stroke();
    }

    /**
     * 画背景图，画所有区域
     * @param canvas 
     * @param ctx 
     * @param areas 
     * @param selectAreaIndex 选择的区域index
     */
    drawAllFunc(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, areas: AreaType[], selectAreaIndex: number = -1) {
        this.drawImg(ctx, this.img, canvas);
        areas.forEach((area, i) => {
            this.drawPoint(ctx, area);
            ctx.beginPath();
            this.drawLine(ctx, area);
            ctx.closePath();
            // 设置选中区域拖动时fill颜色
            if (i === selectAreaIndex) {
                ctx.fillStyle = DefaultStyleVal.move_fill_style;
            } else {
                ctx.fillStyle = DefaultStyleVal.fill_style
            }
            ctx.fill();
        })
    }
    /**
     * 绘制所有的canvas
     * @param selectAreaIndex 选择的区域index
     */
    drawAll(selectAreaIndex: number = -1) {
        this.drawAllFunc(this.canvas, this.ctx, this.areas, selectAreaIndex);
    }

    /**
     * 撤销上一步操作
     */
    undo() {
        // 思路是保存每一次操作于history数组中，栈弹出
        if (this.history.length > 1) {
            // 从历史记录数组中删除最后一项
            this.history.pop();

            // 恢复倒数第二项的图像数据到 canvas 上
            const imageData = this.history[this.history.length - 1];
            this.ctx.putImageData(imageData, 0, 0);

            const A = this.areas[this.areas.length - 1];
            A.points.pop();
    
        }
    }

    /**
     * 获取选中的base64图片
     * @returns base64
     */
    getSelectImage() {
        let imgData = this.clone_ctx.getImageData(0, 0, this.width, this.height);
        for(let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                let index = (y * this.width + x) * 4;
                if (!isAllBzPointInPath(this.areas, x, y)) {
                    imgData.data[index + 3] = 0;
                }
            }
        }
        this.clone_ctx.putImageData(imgData, 0, 0);
        const base64Img = this.clone_canvas.toDataURL();
        this.drawAllFunc(this.clone_canvas, this.clone_ctx, this.areas);
        return base64Img;
    }

    /**
     * 删除第几个区域
     * @param {*} value number 
     * @returns 
     */
    delectArea(value: number) {
        const n = Number(value);
        if (Number.isNaN(n)) {
            console.log('请输入数字');
            return;
        }
        if (this.areas.length < n) {
            console.log('区域不存在');
            return;
        }
        this.areas.splice(n - 1, 1);
        this.drawAllFunc(this.canvas, this.ctx, this.areas);
    }

    /**
     * 重置
     */
    reset() {
        this.drawAllFunc(this.canvas, this.ctx, []);
        this.areas.length = 0;
    }
}
