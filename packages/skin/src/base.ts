import { EventEmitter } from '@attachments/utils/src/public'
import type { StyleOptions, Position } from './types';
import { DefaultStyleVal } from './types';

/**
 * 点对象
 */
export class Point {
  public x: number;
  public y: number;
  public radius: number;
  public color: string;
  public shape: string;

  /**
   * 位置信息
   * @param x 
   * @param options 
   */
  constructor(position: Position, options: StyleOptions) {
    this.x = position.x;
    this.y = position.y;
    this.radius = options.radius || DefaultStyleVal.point_radius;
    this.color = options.color || DefaultStyleVal.point_color;
    this.shape = options.shape || DefaultStyleVal.point_shape;
  }

  /**
   * 配置style
   * @param options 
   */
  public setOptions(options: StyleOptions): void {
    this.radius = options.radius ?? this.radius;
    this.color = options.color ?? this.color;
    this.shape = options.shape ?? this.shape;
  }

}


/**
 * 区域对象
 */
export class Area {
  public points: Point[];
  public isbezier: boolean;
  public isFill: boolean;

  /**
   * 连接线是否是贝塞尔曲线
   * @param isbezier 
   */
  constructor(isbezier = false) {
    this.points = [];
    this.isbezier = isbezier;
    this.isFill = false;
  }
  /**
   * 添加点对象
   * @param point 
   */
  add(...point: Point[]): void {
    this.points.push(...point);
  }
  
}

export const $bus = new EventEmitter();
