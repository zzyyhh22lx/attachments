import type { Position, AreaType } from '../types';

/**
 * 射线法，判断点是否处于polygon的区域内
 * 基本思路是从点向任意方向发射一条射线，然后计算射线与多边形边界的交点数量。如果交点数量为奇数，那么点在多边形内；如果交点数量为偶数，那么点在多边形外。
 * @param {*} point {x, y}
 * @param {*} polygon points[]
 * @returns 
 */
function isPointInPolygon(point: Position, polygon: Position[]): boolean {
    const x = point.x;
    const y = point.y;
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].x;
        const yi = polygon[i].y;
        const xj = polygon[j].x;
        const yj = polygon[j].y;

        const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

        if (intersect) {
            inside = !inside;
        }
    }
    return inside;
}

/**
 * 判断点是否在贝塞尔曲线形成闭合曲线内 - isPointInsideBezierCurve({ x: 100, y: 100 }, p0, p1, p2, p3);
 * @param {*} p0 
 * @param {*} p1 
 * @param {*} p2 
 * @param {*} p3 
 * @param {*} t 
 * @returns 
 */
function pointOnBezierCurve<T extends Position>(p0: T, p1: T, p2: T, p3: T, t: number): T {
    const mt = 1 - t;
    return {
        x: mt * mt * mt * p0.x + 3 * mt * mt * t * p1.x + 3 * mt * t * t * p2.x + t * t * t * p3.x,
        y: mt * mt * mt * p0.y + 3 * mt * mt * t * p1.y + 3 * mt * t * t * p2.y + t * t * t * p3.y,
    } as T;
}

/**
 * 讲贝塞尔曲线点变成多边形计算
 * @param {*} points 
 * @param {*} samples 
 * @returns 
 */
function bezierCurveToPolygon(points: Position[], samples: number = 100): Position[] {
    const polygon: Position[] = [];

    for (let i = 0; i < points.length - 3; i += 3) {
        const p0 = points[i];
        const p1 = points[i + 1];
        const p2 = points[i + 2];
        const p3 = points[i + 3];

        for (let j = 0; j <= samples; j++) {
            const t = j / samples;
            const point = pointOnBezierCurve(p0, p1, p2, p3, t);
            polygon.push(point);
        }
    }
    return polygon;
}


/**
  * 返回是否点在贝塞尔曲线
  * 对于贝塞尔曲线的判定：先判断曲线区域，然后再判断点相连的位置，也就是多边形区域(有bug)
  * 修复：沿贝塞尔曲线采样一些点并连接它们以形成多边形(精度取决于sample大小)
  * @param {*} x 
  * @param {*} y 
  * @param {*} points
*/
export function isBzPointInPath(x: number, y: number, points: Position[]) {
    const polygon = bezierCurveToPolygon(points);
    return isPointInPolygon({ x, y }, polygon);
}

/**
  * 判断点是否为于这些选中区域内
  * @param {*} areas 
  * @param {*} x 
  * @param {*} y 
  * @returns 
*/
export function isAllBzPointInPath(areas: AreaType[], x: number, y: number): boolean {
    let inPath = false;
    for (const area of areas) {
        if (area.isbezier) {
            inPath = isBzPointInPath(x, y, area.points);
        } else {
            inPath = isPointInPolygon({x, y}, area.points);
        }
        if (inPath) return true;
    }
    return false;
}

/**
 * 根据两个点生成俩个位于俩点中间的点
 * @param {*} x1 点1
 * @param {*} x2 点2
 * @returns {x, y}
 */
export function getRandomXY(x1: Position, x2: Position): {rx: number, ry: number} {
    const rx = (x1.x + x2.x) / 2;
    const ry = (x1.y + x2.y) / 2;
    return {
        rx, ry
    }
}