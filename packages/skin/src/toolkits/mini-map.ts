import type { ElementOptions, Size, AreaType } from '../types';
import { DefaultStyleVal } from '../types';
import { BaseMap } from './base-map';

/**
 * 扩展了小地图功能
 */
export class MiniMap extends BaseMap {
    miniCanvas: HTMLCanvasElement;
    miniCtx: CanvasRenderingContext2D;
    miniImg: HTMLImageElement;
    /** 偏移量 */
    offsetX: number;
    offsetY: number;
    /** 点击小地图初始xy值 */
    dragStartX: number;
    dragStartY: number;
    /** 倍数 */
    scale: number;
    /** 与原地图比例 */
    proption: number;

    /** 小地图历史记录 */
    miniHistory: ImageData[];
    /** 缩放监听器函数 */
    onMiniMapWheelListener: (e: WheelEvent) => void;
    onMiniMapDownListener: (e: MouseEvent) => void;
    onMiniMapUpListener: (e: MouseEvent) => void;
    onMiniMapOutListener: (e: MouseEvent) => void;
    onMiniMapMoveListener: (e: MouseEvent) => void;

    constructor(canvas: HTMLCanvasElement, elementOptions: ElementOptions, miniCanvas: HTMLCanvasElement, size: Size) {
        super(canvas, elementOptions);

        this.offsetX = 0;
        this.offsetY = 0;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.scale = 1;
        this.miniHistory = [];

        this.miniCanvas = miniCanvas;
        this.miniCanvas.width = size.width;
        this.miniCanvas.height = size.height;
        this.miniCtx = miniCanvas.getContext("2d", { willReadFrequently: true })!;

        this.miniImg = new Image();
        this.miniImg.src = elementOptions.src;
        this.miniImg.crossOrigin = "anonymous";

        this.miniImg.onload = () => {
            this.drawImg(this.miniCtx, this.miniImg, this.miniCanvas);
            const imageData = this.miniCtx.getImageData(0, 0, this.width, this.height);
            this.miniHistory.push(imageData);
        }

        this.proption = elementOptions.width / size.width;

        this.onMiniMapWheelListener = this.scaleListener.bind(this);
        this.onMiniMapDownListener = this.mousedownListener.bind(this);
        this.onMiniMapMoveListener = this.mousemoveListener.bind(this);
        this.onMiniMapOutListener = this.mouseoutListener.bind(this);
        this.onMiniMapUpListener = this.mouseupListener.bind(this);


        this.miniCanvas.addEventListener('wheel', this.onMiniMapWheelListener);
        this.miniCanvas.addEventListener('mousedown', this.onMiniMapDownListener);
    }


    /**
     * 去除所有监听器
     */
    MiniMap_removeAllListener() {
        this.miniCanvas.removeEventListener('wheel', this.onMiniMapWheelListener);
    }

    /**
     * 清空画布，画背景图图(重置该函数)
     * 清理画布需要清理scale倍数的画布 而不是1比1清理
     * @param ctx 
     * @param img 
     * @param canvas 
     */
    drawImg(ctx: CanvasRenderingContext2D, img: HTMLImageElement, canvas: HTMLCanvasElement) {
        ctx.shadowBlur = 0;
        ctx.shadowColor = DefaultStyleVal.shadow_color;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.globalAlpha = 1;
        const dct = Math.max(DefaultStyleVal.default_clear_time, 1 / this.scale);
        // 防止清理画布不干净出现图像重叠
        ctx.clearRect(0, 0, canvas.width * dct, canvas.height * dct);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }

    /**
     * 画当前区域所有的点(重置该函数)
     * 对于缩放的时候 需要将radius/scale 不然显示有问题
     * @param {*} ctx 
     * @param {*} area 
     */
    drawPoint(ctx: CanvasRenderingContext2D, area: AreaType) {
        const { points } = area;
        points.forEach(p => {
            ctx.moveTo(p.x, p.y);
            ctx.globalAlpha = 0.85;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius / this.scale, 0, Math.PI*2);
            ctx.closePath();
            ctx.fillStyle = p.color;
            ctx.strokeStyle = DefaultStyleVal.stroke_style;
            ctx.fill();
        })
    }

    /**
     * 绘制当前所有canvas
     * @param selectAreaIndex 选择的区域index
     */
    drawAll(selectAreaIndex: number = -1) {
        const _this = this;
        this.drawAllFunc(this.miniCanvas, _this.miniCtx, this.areas.map(item => {
            // 缩放点
            const updatedPoints = item.points.map(point => {
              return {
                ...point,
                radius: point.radius / this.proption,
                x: point.x / this.proption,
                y: point.y / this.proption
              };
            });
          
            return {
              ...item,
              points: updatedPoints
            };
        }), selectAreaIndex);

        // 重置缩放矩阵
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        // 缩放
        this.ctx.translate(this.offsetX, this.offsetY);
        this.ctx.scale(this.scale, this.scale);
        this.drawAllFunc(this.canvas, this.ctx, this.areas, selectAreaIndex);
        
        // 小地图绘制边框(缩放时定位)
        this.miniCtx.strokeStyle = DefaultStyleVal.mini_stroke_style;
        this.miniCtx.lineWidth = DefaultStyleVal.mini_line_width;
        this.miniCtx.strokeRect(
            -this.offsetX / this.proption / this.scale,
            -this.offsetY / this.proption / this.scale,
            this.miniCanvas.width / this.scale,
            this.miniCanvas.height / this.scale
        );
    }

    /**
     * 缩放地图
     * @param e 
     */
    scaleListener(e: WheelEvent) {
        e.preventDefault();
        // 根据滚轮方向调整缩放级别
        this.scale += (e.deltaY < 0 ? 1 : -1) * DefaultStyleVal.scale_step;

        this.scale = Math.max(this.scale, 1); // 不能缩小，只能放大

        // 超出canvas重置
        if (
            (-this.offsetX > (this.width * (this.scale - 1))) ||
            -this.offsetY > (this.height * (this.scale - 1))
        ) {
            this.offsetX = 0;
            this.offsetY = 0;
        }

        this.drawAll();
    }

    /** 鼠标点击事件 */
    mousedownListener(e: MouseEvent) {
        this.dragStartX = e.clientX;
        this.dragStartY = e.clientY;
        this.miniCanvas.addEventListener('mousemove', this.onMiniMapMoveListener);
        this.miniCanvas.addEventListener('mouseup', this.onMiniMapUpListener);
        this.miniCanvas.addEventListener('mouseout', this.onMiniMapOutListener);
    }
    /** move */
    mousemoveListener(e: MouseEvent) {
        const deltaX = e.clientX - this.dragStartX;
        const deltaY = e.clientY - this.dragStartY;

        const newOffsetX = this.offsetX - deltaX * this.proption * this.scale;
        const newOffsetY = this.offsetY - deltaY * this.proption * this.scale;

        const minOffsetX = (1 - this.scale) * (this.width - 4);
        const minOffsetY = (1 - this.scale) * (this.height - 4);
        const maxOffsetX = 0;
        const maxOffsetY = 0;
        
        this.offsetX = Math.min(Math.max(newOffsetX, minOffsetX), maxOffsetX);
        this.offsetY = Math.min(Math.max(newOffsetY, minOffsetY), maxOffsetY);

        this.dragStartX = e.clientX;
        this.dragStartY = e.clientY;

        this.drawAll();
    }
    /** up */
    mouseupListener(e: MouseEvent) {
        this.miniCanvas.removeEventListener('mousemove', this.onMiniMapMoveListener);
    }
    /** out */
    mouseoutListener(e: MouseEvent) {
        this.miniCanvas.removeEventListener('mousemove', this.onMiniMapMoveListener);
        this.miniCanvas.removeEventListener('mouseup', this.onMiniMapUpListener);
        this.miniCanvas.removeEventListener('mouseout', this.onMiniMapOutListener);
    }
}
