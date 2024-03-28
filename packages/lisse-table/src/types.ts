export type configType = {
    data: string[][],
    columns: string[],
    colTypes?: [],
    options?: any,
    dpr?: number,
    canvasHeight?: number,
    canvasWidth?: number,
}

/** rect */
export type rectType = {
    x: number;
    y: number;
    width: number;
    height: number;
}

/** 一个单元格数据的类型 */
export type dataType = {
    /** 完整的文本 */
    fullText: string;
    /** 裁剪后的文本 */
    text: string;
    /** textX 文本的第一个字符的x坐标 */
    tx: number;
    ty: number;
    /** 单元格的x坐标 */
    x: number;
}

/** td每行的类型 */
export type tdType = {
    data: dataType[];
    height: number;
    y: number;
    /** data length */
    length?: number;
}

export type tableDataType = {
    th: {
        data: dataType[];
        height: number;
        /** 代表每列的宽度 */
        width: number[];
    };
    td: tdType[]
}
