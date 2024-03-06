import type { ElementOptions, Size } from '../../types';
import { Point, Area } from '../../base';
import { DefaultStyleVal } from '../../types';
import { MiniMap } from '../mini-map';

/**
 * 单点功能
 */
export class SingleClick extends MiniMap {
    // 
    lineStatus: boolean;
    // 是否可画
    canDraw: boolean;

    selectAreaIndex: number;
    selectPointIndex: number;
    isMouseDown: boolean;
    isDraw: boolean;

    downx: number;
    downy: number;

    onSingledownListner: (e: MouseEvent) => void;
    onSingleUpListner: (e: MouseEvent) => void;
    onSingleMoveListner: (e: MouseEvent) => void;

    /**
     * 
     * @param {*} canvas 
     * @param {*} elementOptions
     */
    constructor(canvas: HTMLCanvasElement, elementOptions: ElementOptions, MiniCanvas: HTMLCanvasElement, size: Size) {
        super(canvas, elementOptions, MiniCanvas, size);

        this.lineStatus = false;
        this.canDraw = true;

        this.selectAreaIndex = -1;
        this.selectPointIndex = -1;
        this.isMouseDown = false;
        this.isDraw = true;

        this.onSingledownListner = this.onMouseDown.bind(this);
        this.onSingleUpListner = this.onMouseUp.bind(this);
        this.onSingleMoveListner = this.onMouseMove.bind(this);

        this.downx = 0;
        this.downy = 0;

        this.canvas.addEventListener('mousedown', this.onSingledownListner);
        this.canvas.addEventListener('mousemove', this.onSingleMoveListner);
        this.canvas.addEventListener('mouseup', this.onSingleUpListner);
    }

    /**
     * 鼠标按下
     * @param {*} e 
     */
    onMouseDown(e: MouseEvent) {
        const x = e.pageX - this.canvas.offsetLeft;
        const y = e.pageY - this.canvas.offsetTop;
        this.downx = x;
        this.downy = y;
        this.isMouseDown = true;

        let { pointIndex, areaIndex } = this.findPointIndex(this.ctx, this.areas, x, y); // 先找点，看看用户长按的是不是某个区域的某个点，找到了就不用再找区域了

        if (areaIndex === -1) areaIndex = this.drawAndFindAreaIndex(this.ctx, this.areas, x, y); // 找不到点，再找区域，看看用户是不是长按了某个区域

        if (areaIndex >= 0) {
            this.canDraw = false;
            this.selectAreaIndex = areaIndex;
            this.selectPointIndex = pointIndex;
        } else {
            this.isDraw = true;
            this.clickPoint(e);
        }
    }

    /**
     * 鼠标取消点击
     * @param {*} e 
     */
    onMouseUp(e: MouseEvent) {
        this.isMouseDown = false;
        this.drawAllFunc(this.canvas, this.ctx, this.areas);

        this.isDraw = false;
        this.lineStatus = false;
        this.canDraw = true;
    }

    /**
     * 鼠标移动
     * @param {*} e 
     * @returns 
     */
    onMouseMove(e: MouseEvent) {
        if (this.isMouseDown && this.isDraw) {
            this.clickPoint(e);
        } else {// 移动的时候，计算差值，然后改变区域的位置，重新绘制
            if (!this.isMouseDown || this.lineStatus || this.selectAreaIndex === -1) return;
            const x = e.pageX - this.canvas.offsetLeft;
            const y = e.pageY - this.canvas.offsetTop;
            const disx = x - this.downx;
            const disy = y - this.downy;
            const { points } = this.areas[this.selectAreaIndex];
            if (this.selectPointIndex >= 0) {
                points[this.selectPointIndex].x += disx;
                points[this.selectPointIndex].y += disy;
            } else {
                points.forEach(p => {
                    p.x += disx;
                    p.y += disy;
                })
            }
            this.downx = x;
            this.downy = y;
            this.drawAllFunc(this.canvas, this.ctx, this.areas, this.selectAreaIndex);
        }
    }

    /**
     * 绘画
     * @param {*} e 
     * @returns 
     */
    clickPoint(e: MouseEvent) {
        if (!this.canDraw) return; // 判断用户选中了已画的某个区域，就不再画点了
        let firstPoint = false; // 是不是这个区域的第一个点
        let area: (Area | null) = null;
        if (!this.lineStatus) { // 第一个点
            this.lineStatus = true;
            area = new Area();
            firstPoint = true;
        } else if (this.areas.length > 0) {
            area = this.areas[this.areas.length - 1];
        }
        const x = e.pageX - this.canvas.offsetLeft;
        const y = e.pageY - this.canvas.offsetTop;
        const index = this.clickPointIndex(x, y, area!); //判断当前点击的位置在不在已画的某个点上
        const p = new Point({ x, y }, {
            radius: DefaultStyleVal.point_radius as number,
            shape: DefaultStyleVal.point_shape as string,
            color: DefaultStyleVal.point_color as string
        });
        area!.add(p); // 判断是继续画点的

        // 先画之前所有的区域，在画本次未完成的点线
        this.drawAllFunc(this.canvas, this.ctx, this.areas.filter((i, j) => (j < this.areas.length - 1 || firstPoint)));
        this.drawPoint(this.ctx, area!);
        this.ctx.beginPath();
        this.drawLine(this.ctx, area!);

        if(index === -1) { // 新区域首个点，保存数据到数组中
            if (firstPoint) this.areas.push(area!);
        }

        this.ctx.closePath();
        this.ctx.fillStyle = DefaultStyleVal.fill_style;
        this.ctx.fill();

        this.ctx.restore();

        const imageData = this.ctx.getImageData(0, 0, this.width, this.height);
        this.history.push(imageData);
    }

    /**
     * 画当前区域所有的点
     * @param {*} ctx 
     * @param {*} area 
     */
    drawPoint(ctx: CanvasRenderingContext2D, area: Area) {
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
    drawLine(ctx: CanvasRenderingContext2D, area: Area) {
        const { points } = area;
        points.forEach((p,i) => {
            if (i === 0) {
                ctx.moveTo(p.x, p.y)
            } else {
                ctx.lineTo(p.x, p.y)
            }
        })
        ctx.lineWidth = 1;
        ctx.strokeStyle = DefaultStyleVal.line_stroke_style;
        ctx.stroke();
    }

    /**
     * 计算当前坐标是不是在当前区域的路径点上，并返回下标
     * @param {*} x 
     * @param {*} y 
     * @param {*} area 
     * @returns 
     */
    clickPointIndex(x: number, y: number, area: Area) {
        const { points } = area;
        for(let i = 0; i < points.length; i++) {
            const p = points[i];
            //使用勾股定理计算这个点与圆心之间的距离
            const distanceFromCenter = Math.sqrt(Math.pow(p.x - x, 2)
                + Math.pow(p.y - y, 2));
            if (distanceFromCenter <= p.radius) {
                //停止搜索
                return i;
            }
        }
        return -1;
    }



    /**
     * 画所有区域，并且找到当前坐标在哪个区域上，并返回下标
     * @param {*} ctx 
     * @param {*} areas 
     * @param {*} x 
     * @param {*} y 
     * @returns 
     */
    drawAndFindAreaIndex(ctx: CanvasRenderingContext2D, areas: Area[], x: number, y: number) {
        ctx.clearRect(0, 0, this.width, this.height);
        let index = -1;
        areas.forEach((area, i) => {
            this.drawPoint(ctx, area);
            ctx.beginPath();
            this.drawLine(ctx, area);
            ctx.closePath();
            const inPath = ctx.isPointInPath(x, y);
            if (inPath) index = i;
            ctx.fillStyle = DefaultStyleVal.fill_style;
            ctx.fill();
        })
        return index;
    }

    /**
     * 找到当前坐标在哪个区域的哪个坐标点上，并将两个下标返回
     * @param {*} ctx 
     * @param {*} areas 
     * @param {*} x 
     * @param {*} y 
     * @returns 
     */
    findPointIndex(ctx: CanvasRenderingContext2D, areas: Area[], x: number, y: number) {
        let areaIndex = -1;
        let pointIndex = -1;
        areas.forEach((area, i) => {
            if (areaIndex >= 0) return;
            const index = this.clickPointIndex(x, y, area);
            if (index >= 0) {
                areaIndex = i;
                pointIndex = index;
            }
        })
        return {
            areaIndex,
            pointIndex
        }
    }

}
