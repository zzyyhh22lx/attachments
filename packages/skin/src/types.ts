export type StyleOptions = {
  radius: number;
  color: string;
  shape: string;
};

export type Position = {
  x: number;
  y: number;
};

export type PointType = StyleOptions & Position;

export type AreaType = {
  points: PointType[];
  isbezier: boolean;
}

export type ElementDistance = {
  leftDistance: number;
  topDistance: number;
}

export type Size = {
  width: number;
  height: number;
}

export type ElementOptions = Size & {
  src: string;
}

export enum DefaultStyleVal {
  /** 清理的最小倍数 */
  default_clear_time = 10,
  /** 点大小 */
  point_radius = 5,
  point_color = 'transparent',
  point_shape = 'circle',
  
  shadow_color = 'rgba(0, 0, 0)',
  move_fill_style = 'rgba(0,0,0,0.8)',
  fill_style = 'rgba(0,0,0,0.5)',
  stroke_style = 'black',
  line_stroke_style = 'red',
  line_width = 1,

  /** 滚轮一次移动缩放倍数 */
  scale_step = 0.1,
  mini_stroke_style = '#6C8AFF',
  mini_line_width = 1,
}
