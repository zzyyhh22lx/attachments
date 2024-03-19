import type { ElementOptions, Size } from '../../types';
import { Point, Area } from '../../base';
import { DefaultStyleVal } from '../../types';
import type { StyleOptions } from  '../../types';
import { isAllBzPointInPath, getRandomXY } from '../../utils/geometry-utils';
import { deepClone } from '../../utils';
import { MiniMap } from '../mini-map';

/**
 * 绘制贝塞尔曲线功能 
 */
export class BeZierClick extends MiniMap {
    /** 选择的区域 */
    selectAreaIndex: number;
    /** 选取的点 */
    selectPointIndex: number;
    /** 贝塞尔曲线点计数(4,3,3,3..) */
    pointCounter: number;
    /** 贝塞尔曲线是否闭合 */
    isFill: boolean;
    lineStatus: boolean;
    /** 首次点击时的xy */
    downx: number;
    downy: number;

    onBeZierdownListner: (e: MouseEvent) => void;
    onBeZierUpListner: (e: MouseEvent) => void;
    onBeZierPointMoveListner: (e: MouseEvent) => void;
    onBeZierAreaMoveListner: (e: MouseEvent) => void;

    constructor(canvas: HTMLCanvasElement, elementOptions: ElementOptions, MiniCanvas: HTMLCanvasElement, size: Size) {
        super(canvas, elementOptions, MiniCanvas, size);

        this.selectAreaIndex = -1;
        this.selectPointIndex = -1;
        this.pointCounter = 0;
        this.isFill = true;
        this.lineStatus = false;

        this.downx = 0;
        this.downy = 0;

        this.onBeZierdownListner = this.onMouseDown.bind(this);
        this.onBeZierUpListner = this.onMouseUp.bind(this);
        this.onBeZierPointMoveListner = this.onMousePointMove.bind(this);
        this.onBeZierAreaMoveListner = this.onMouseAreaMove.bind(this);

        this.canvas.addEventListener('mousedown', this.onBeZierdownListner);
    }
    /**
     * 贝塞尔曲线鼠标点击事件
     * 思路是：四个点为一组，首个点不添加，后面的点会往中间添加俩辅助点
     * 
     */
    onMouseDown(e: MouseEvent) {
        if (e.button !== 0) return;
        const {
            x, y
        } = this.getXY(e, this.canvas);
        this.downx = x;
        this.downy = y;
        let { pointIndex, areaIndex } = this.findAllIndex(e);
        console.log(areaIndex, pointIndex);
        if (areaIndex >= 0) { // 找到点或区域(拖动)
            if (pointIndex >= 0) { // 触发点移动
                this.canvas.addEventListener('mousemove', this.onBeZierPointMoveListner);
            } else {
                this.canvas.addEventListener('mousemove', this.onBeZierAreaMoveListner);
            }
            this.canvas.addEventListener('mouseup', this.onBeZierUpListner);
        } else { // 画点
            let area: Area;
            if(this.isFill) {
                this.isFill = false;
                area = new Area(true);
                this.areas.push(area);
            } else {
                area = this.areas[this.areas.length - 1];
            }
            if (this.pointCounter < 2) {
                const pointOptions = {
                    radius: DefaultStyleVal.point_radius,
                    color: DefaultStyleVal.bezier_color,
                    shape: DefaultStyleVal.point_shape,
                };
                const point = new Point({ x, y }, pointOptions as StyleOptions);
                area.add(point);

                this.pointCounter++;
                const P = area.points;
                if (this.pointCounter === 2 || P.length > 1) {
                    // 自动补充辅助点
                    const [point1, point4] = P.splice(-2);
                    const { rx, ry } = getRandomXY(point1, point4);
                    /** 辅助点2 */
                    const pointAuxOption = {
                        radius: DefaultStyleVal.point_radius,
                        color: DefaultStyleVal.bezier_aux_color,
                        shape: DefaultStyleVal.bezier_aux_shape,
                    };
                    const point2 = new Point({ x: rx, y: ry}, pointAuxOption as StyleOptions);
                    /** 辅助点3 */
                    const point3 = new Point({ x: rx, y: ry}, pointAuxOption as StyleOptions);
                    area.add(point1,point2,point3,point4);
                    this.pointCounter = 0;
                }
                this.drawAllArea(this.ctx, this.areas);
                this.history.push(deepClone(this.areas));
            }
        }
    }
    /**
     * 鼠标移除
     */
    onMouseUp() {
        this.canvas.removeEventListener('mousemove', this.onBeZierPointMoveListner);
        this.canvas.removeEventListener('mousemove', this.onBeZierAreaMoveListner);
        this.canvas.removeEventListener('mouseup', this.onBeZierUpListner);
    }
    /**
     * 鼠标移动 down时区域的移动
     * @param e 
     */
    onMouseAreaMove(e: MouseEvent) {
        if (e.button !== 0) return;
        const {
            x, y
        } = this.getXY(e, this.canvas);
        const disx = x - this.downx;
        const disy = y - this.downy;
        const {points} = this.areas[this.selectAreaIndex];
        points.forEach(p => {
            p.x += disx;
            p.y += disy;
        });
        this.downx = x;
        this.downy = y;
        this.drawAllArea(this.ctx, this.areas);
        this.addHistory();
    }
    /**
     * down时 点的移动
     */
    onMousePointMove(e: MouseEvent) {
        const {
            x, y
        } = this.getXY(e, this.canvas);
        const point = this.areas[this.selectAreaIndex].points[this.selectPointIndex]
        point.x = x;
        point.y = y;
        this.drawAllArea(this.ctx, this.areas);
        this.addHistory();
    }

    /**
     * 判断点击的点是否在框选区域上, 如果有则设置(鼠标右键)
     * this.selectAreaIndex
     * this.selectPointIndex
     * @param {*} e 
     * @return { pointIndex, areaIndex }
     */
    findAllIndex(e: MouseEvent): {pointIndex: number, areaIndex: number} {
        const {
            x, y
        } = this.getXY(e, this.canvas); 
        let { pointIndex, areaIndex } = this.findPointIndex(this.ctx, this.areas, x, y); // 先找点，看看用户长按的是不是某个区域的某个点，找到了就不用再找区域了
        console.log(areaIndex, pointIndex);
        if (areaIndex === -1) {
            areaIndex = this.findAreaIndex(this.ctx, this.areas, x, y);
        } //找不到点，再找区域，看看用户是不是长按了某个区域
        
            if (areaIndex >= 0) {
                this.selectAreaIndex = areaIndex;
                this.selectPointIndex = pointIndex;
            };
        return {
            pointIndex, areaIndex
        }
    }

    /**
     * 找到当前坐标在哪个区域的哪个坐标点上，并将两个下标返回
     * @param {*} ctx 
     * @param {*} areas 
     * @param {*} x 
     * @param {*} y 
     * @returns 
     */
    findPointIndex(ctx, areas, x, y) {
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

    /**
     * 找到当前坐标在哪个区域上，并返回下标
     * @param {*} ctx 
     * @param {*} areas 
     * @param {*} x 
     * @param {*} y 
     * @returns 
     */
    findAreaIndex(ctx, areas, x, y) {
        let index = -1;
        areas.forEach((area, i) => {
            // ctx.isPointInPath检查指定的点是否在当前路径中
            if (isAllBzPointInPath(area, x, y)) index = i;
        })
        return index;
    }

    /**
     * 计算当前坐标是不是在当前区域的路径点上，并返回下标
     * @param {*} x 
     * @param {*} y 
     * @param {*} area 
     * @returns 
     */
    clickPointIndex(x, y, area) {
        const { points } = area;
        for(let i = 0; i < points.length; i++) {
            const p = points[i];
            //使用勾股定理计算这个点与圆心之间的距离
            const distanceFromCenter = Math.sqrt(Math.pow(p.x - x, 2)
                + Math.pow(p.y - y, 2));
            if (distanceFromCenter <= (p.radius / this.scale)) {
                //停止搜索
                return i;
            }
        }
        return -1;
    }

    /**
     * 画所有矩形区域(判断是否闭合) 并返回带贝塞尔曲线的点[x, x, x](贝塞尔绘画方式不一样)
     * @param {*} ctx 
     * @param {*} areas 
     * @param {*} selectAreaIndex 选择的区域
     * @return 返回带贝塞尔曲线的areas下标[x, x, x]
     */
    drawFillLine(ctx, areas, selectAreaIndex = -1) {
        const bezierIndexs: number[] = [];
        let j = 0;
        for(let i = 0; i < areas.length; i++) {
            const area = areas[i];
            if(area.isbezier) {
                bezierIndexs.push(i);
                continue;
            } else {
                j = i;
            }
            this.drawPoint(ctx, area);
            ctx.beginPath();
            this.drawLine(ctx, area);
            ctx.closePath();
            // 设置选中拖动时fill颜色
            if (i === selectAreaIndex) {
                ctx.fillStyle = DefaultStyleVal.move_fill_style;
            } else {
                ctx.fillStyle = DefaultStyleVal.fill_style;
            }
            ctx.fill();
        }
        if (areas[j]) {
            const { points } = areas[j];
            if (points.length >= 3) { // 三点才能练成图形
                // 判断闭合
                const { x, y } = points[points.length - 1];
                //使用勾股定理计算这个点与圆心之间的距离
                const distanceFromCenter = Math.sqrt(Math.pow(x - points[0].x, 2)
                    + Math.pow(y - points[0].y, 2));
                if (distanceFromCenter <= (points[0].radius / this.scale)) {
                    this.lineStatus = false;
                }
            }
        }
        return bezierIndexs;
    }

    /**
     * 绘制贝塞尔曲线及辅助线
     * @param {*} ctx 
     * @param {*} points 
     * @param {*} index 默认-1 贝塞尔曲线传(用来添加路径)
     */
    drwaBezierLine(ctx, points) {
        for (let i = 0; i + 3 < points.length; i += 3) {
            const startPoint = points[i];
            const controlPoint1 = points[i + 1];
            const controlPoint2 = points[i + 2];
            const endPoint = points[i + 3];
            // Draw bezier curve
            ctx.moveTo(startPoint.x, startPoint.y);
            ctx.bezierCurveTo(controlPoint1.x, controlPoint1.y, controlPoint2.x, controlPoint2.y, endPoint.x, endPoint.y);

            ctx.strokeStyle = DefaultStyleVal.bezier_aux_strokestyle;
            ctx.stroke();
            // Draw control lines
            this.drawControlLine(ctx, startPoint, controlPoint1);
            this.drawControlLine(ctx, endPoint, controlPoint2);
        }
    }

    /**
     * 绘制辅助线直线
     * @param {*} ctx 
     * @param {*} startPoint 
     * @param {*} controlPoint 
     */
    drawControlLine(ctx, startPoint, controlPoint) {
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(controlPoint.x, controlPoint.y);
        ctx.strokeStyle = DefaultStyleVal.bezier_aux_strokestyle;
        ctx.stroke();
    }

    /**
     * 绘制所有线：贝塞尔曲线+线段框选区域
     * @param {*} ctx 
     * @param {*} areas 
     */
    drawAllArea(ctx = this.ctx, areas = this.areas, canvas = this.canvas) {
        // 重置缩放矩阵
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        // 缩放
        this.ctx.translate(this.offsetX, this.offsetY);
        this.ctx.scale(this.scale, this.scale);
        if (this.img) this.drawImg(ctx, this.img, canvas);
        // 贝塞尔曲线的点和直接单点连线是不一样的
        const bezierIndexs = this.drawFillLine(ctx, areas);

        bezierIndexs.forEach(bzIndex => {
            const points = areas[bzIndex].points;
            ctx.beginPath();
            this.drwaBezierLine(ctx, points);
            // closePath将当前子路径的起始点和结束点连接
            ctx.closePath();
            
            // 闭合曲线 填充颜色
            if (points.length > 2) {
                // 第一个点和最后一个点不能是同个点  
                const firstPoint = points[0];
                const lastNonControlPoint = points[points.length - 1];
                const dx = firstPoint.x - lastNonControlPoint.x;
                const dy = firstPoint.y - lastNonControlPoint.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if(distance <= firstPoint.radius) { // 数组的第一个点和最后一个点近似重合
                    this.fillBezier(ctx, points);
                    // 如果是最后一个数组才触发(否则会出现前面有闭合曲线，后面全都是新建点的问题)
                    if (bzIndex === bezierIndexs[bezierIndexs.length - 1]) this.isFill = true;
                }
            }
            // Draw points
            this.drawPoint(ctx, areas[bzIndex]);
        })
    }

    /**
     * 绘制闭合的贝塞尔曲线
     * @param {*} ctx 
     * @param {*} points 
     */
    fillBezier(ctx, points) {
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 0; i + 3 < points.length; i += 3) {
            const startPoint = points[i];
            const controlPoint1 = points[i + 1];
            const controlPoint2 = points[i + 2];
            const endPoint = points[i + 3];
            ctx.bezierCurveTo(controlPoint1.x, controlPoint1.y, controlPoint2.x, controlPoint2.y, endPoint.x, endPoint.y);
        }
        ctx.fillStyle = DefaultStyleVal.fill_style;
        ctx.fill();
        ctx.stroke();
    }

    /**
     * 获取原图大小的图片选中区域
     * 用数学方法和webworker计算areas点拿到图形
     */
    getAllSelectImage() {

    }
}
