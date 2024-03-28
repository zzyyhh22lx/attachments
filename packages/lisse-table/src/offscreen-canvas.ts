import { mergeDeep } from './utils';
import { defaultOptions } from './default-options';
import type { configType, tableDataType, tdType, rectType, dataType } from './types';

/**
 * @class LisseTableOffscreenCanvas
 * @description Generate table with offscreencanvas.
 */
class LisseTableOffscreenCanvas {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  columWidths: any;
  canvasWidth: any;
  canvasHeight: any;
  data: any;
  columns: any;
  colTypes: any;
  options: any;
  /** scrollX 滚动条移动的距离 */
  x: number;
  /** scrollY */
  y: number;
  tableWidth: number;
  tableHeight: number;
  dpr: any;
  clickRect: any;
  tableData: tableDataType;
  sortInfo: any;
  startCellIdx: number | undefined;
  endCellIdx: any;
  wordWidth: any;
  /**
   * @constructor
   * @param {HTMLCanvasElement} canvas - The canvas element.
   * @param {object} config - The Config options.
   */
  constructor(canvas: HTMLCanvasElement, config: configType) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;

    this.initOpt(config);
  }

  // options初始化
  initOpt(config: configType) {
    const {
      data,
      columns = [],
      colTypes = [],
      options = {},
      dpr,
      canvasHeight,
      canvasWidth,
    } = config;
    this.columWidths = [];
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.data = data;
    this.columns = columns;
    this.colTypes = colTypes;
    this.options = mergeDeep(defaultOptions, options);
    this.x = 0;
    this.y = 0;
    this.tableWidth = 0;
    this.tableHeight = 0;
    this.dpr = dpr;
    this.clickRect = null;
    this.tableData = {
      th: {
        width: [],
        data: [],
      },
      td: [],
    };
    this.sortInfo = {
      col: '',
      order: -1,
    };
    this.startCellIdx = undefined;
    this.endCellIdx = undefined;

    this.ctx.font = `${this.options.cell.fontWeight} ${this.options.cell.fontSize}px ${this.options.cell.fontFamily}`;
    this.wordWidth = this.ctx.measureText('a').width;
  }

  /**
   * 调整某一列的列宽
   * @param info 
   */
  changeColsWidth(info) {
    const {
      tableData: { th },
    } = this;
    const { value: moveRange, index: moveIndex } = info;
    th.width[moveIndex] += moveRange;
    this.tableWidth += moveRange;
    th.data[moveIndex].tx += moveRange / 2;

    for (let colIndex = 0, len = th.data.length; colIndex < len; colIndex++) {
      if (!th.data[colIndex + 1] || colIndex < moveIndex) {
        continue;
      }
      th.data[colIndex + 1].x += moveRange;
      th.data[colIndex + 1].tx += moveRange;
    }
    
    // 列宽变化时重新计算数据并重绘
    this.clickRect = null;
    this.processData();
    this.updateTable();
  }

  /**
   * resize重新绘制表格(适配)
   * @param param0 { canvasWidth, canvasHeight }
   */
  resize({ canvasWidth, canvasHeight }) {
    if (canvasHeight) {
      this.canvasHeight = canvasHeight;
      this.canvas.height = canvasHeight;
    }

    if (canvasWidth) {
      this.canvasWidth = canvasWidth;
      this.canvas.width = canvasWidth;
    }

    this.adaptDpr();

    this.calcColsWidth();
    this.processData();
    this.updateTable();

  }

  sortData(index) {
    const { sortInfo, colTypes } = this;
    sortInfo.col = index;
    sortInfo.order = index === sortInfo.col ? -sortInfo.order : 1;
    let compareFn;
    if (
      /^(bigint|int|long|number|double|tinyint|smallint|integer|real|decimal)$/i.test(
        colTypes[index],
      )
    ) {
      compareFn = (a, b) =>
        sortInfo.order === -1
          ? Object.values(a)[index] - Object.values(b)[index]
          : Object.values(b)[index] - Object.values(a)[index];
    } else {
      compareFn = (a, b) =>
        sortInfo.order === -1
          ? Object.values(a)[index].localeCompare(Object.values(b)[index])
          : Object.values(b)[index].localeCompare(Object.values(a)[index]);
    }
    this.data.sort(compareFn);

    this.updateData();
  }

  /**
   * 处理数据(并且为所有tbody的数据添加坐标点)
   * @param param0 { appendData添加的数据, isAppend: boolean 是否是添加的数据(为fasle则整个data替换) }
   */
  processData(appendData: dataType[] | null = null, isAppend = false) {
    const {
      columns,
      data,
      tableData: { th },
      options: { cell },
    } = this;

    const tableDataRows: tdType[] = [];

    for (let i = 0, len = columns.length; i < len; i++) {
      const cellHeight =
        cell.fontSize * cell.lineHeight +
        cell.padding.top +
        cell.padding.bottom;

      const cellY =
        cell.padding.top + ((cell.lineHeight - 1) * cell.fontSize) / 2;

      const tblData = appendData || data;

      for (let rowIdx = 0, len2 = tblData.length; rowIdx < len2; rowIdx++) {
        const row = tblData[rowIdx];
        let cx = 0;
        let cy = isAppend
          ? cellHeight * rowIdx + this.tableHeight
          : cellHeight * rowIdx;

        if (!isAppend) {
          cy += th.height;
        }

        tableDataRows[rowIdx] = {
          y: cy,
          height: cellHeight,
          data: [],
        };

        const rowKeys = Object.keys(row);
        for (
          let cellIdx = 0, len3 = rowKeys.length;
          cellIdx < len3;
          cellIdx++
        ) {
          const key = rowKeys[cellIdx];
          const cex =
            cell.textAlign === 'center' ? cx + th.width[cellIdx] / 2 : cx;
          // const cellText = this.textOverflow(key, cellIdx);
          const cellData = {
            x: cx,
            tx: cex,
            ty: cy + cellY,
            text: '',
            fullText: row[key],
          };
          tableDataRows[rowIdx].data[cellIdx] = cellData;
          cx += th.width[cellIdx];
        }

        cy += cellHeight;
      }
    }

    this.tableData.td = isAppend
      ? [...this.tableData.td, ...tableDataRows]
      : [...tableDataRows];
    const lastRow = this.tableData.td[this.tableData.td.length - 1] || {
      y: 0,
      height: 0,
    };
    this.tableHeight = lastRow.y + lastRow.height;
    // 新增数据处理完之后触发更新
    if (isAppend) {
      this.updateTable();
    }

    self.postMessage({
      tableData: this.tableData,
      tableHeight: this.tableHeight,
    });
  }

  /**
   * 处理文本溢出
   * 每次裁剪1/3，知道不超出单元格长度
   * @param text 
   * @param index 
   * @returns 
   */
  textOverflow(text: string, index: number) {
    const {
      ctx,
      tableData: { th },
      options: { cell },
    } = this;

    let cellText = String(text);

    ctx.font = `${cell.fontWeight} ${cell.fontSize}px ${cell.fontFamily}`;

    if (
      ctx.measureText(cellText).width +
        cell.padding.left +
        cell.padding.right >=
      th.width[index]
    ) {
      do {
        cellText = cellText.slice(0, (cellText.length * 2) / 3);
      } while (
        ctx.measureText(`${cellText}...`).width +
          cell.padding.left +
          cell.padding.right >
          th.width[index] &&
        cellText.length > 2
      );
      cellText += '...';
    }

    return cellText;
  }

  // 计算列宽
  calcColsWidth() {
    const {
      columns,
      ctx,
      canvasWidth,
      tableData: { th },
      options: { head, fit, column },
    } = this;
    let { x: headCellX } = this;
    th.height =
      head.fontSize * head.lineHeight + head.padding.top + head.padding.bottom;
    const headCellY =
      this.y + head.padding.top + ((head.lineHeight - 1) * head.fontSize) / 2;

    ctx.font = `${head.fontWeight} ${head.fontSize}px ${head.fontFamily}`;
    ctx.fillStyle = head.color;
    ctx.textAlign = head.textAlign;
    ctx.textBaseline = 'top';

    const colsWidth: number[] = [];

    this.tableWidth = 0;

    for (let i = 0, len = columns.length; i < len; i++) {
      const item = columns[i];
      const colWidth = Math.max(
        ctx.measureText(item.title || item).width +
          head.padding.left +
          head.padding.right,
        column.maxWidth,
      );

      // 计算表格实际宽度
      this.tableWidth += colWidth;

      colsWidth.push(colWidth);
    }
    // 宽度自适应场景
    if (fit || this.tableWidth < this.canvasWidth) {
      th.width = Array(columns.length).fill(this.canvasWidth / columns.length);
      this.tableWidth = canvasWidth;
    } else {
      th.width = colsWidth;
    }

    for (let i = 0, len = columns.length; i < len; i++) {
      // 这里只自适应了表头th的宽度，对于表tbody的td，需要重新计算
      const item = columns[i];
      th.data[i] = {
        x: headCellX,
        tx: // 这里设置了center，则tx值相当于measure字符串中间的位置
          head.textAlign === 'center' ? headCellX + th.width[i] / 2 : headCellX,
        ty: headCellY,
        text: item.title || item,
        fullText: item.title || item
      };

      headCellX += th.width[i];
    }

    self.postMessage({
      tableWidth: this.tableWidth,
    });
  }

  createTable() {
    // 计算列宽
    this.calcColsWidth();

    // 处理数据
    this.processData();

    // dpr适配
    this.adaptDpr();

    // 绘制表格
    this.drawTable();
  }

  clearTable() {
    const { ctx, canvasWidth, canvasHeight } = this;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  }

  setClickRect(rect: rectType) {
    this.clickRect = rect;
  }

  /**
   * 更新表格绘制(api)
   * @param x 
   * @param y 
   */
  updateTable(x = this.x, y = this.y) {
    this.x = x;
    this.y = y;

    this.drawTable();
  }

  /**
   * 更新数据
   * @param updateData 
   */
  updateData(updateData = null) {
    if (updateData) {
      this.data = updateData;
    }
    this.clickRect = null;
    this.processData();
    this.updateTable();
  }

  /**
   * 绘制垂直分割线
   * @param x 
   * @param sy 
   * @param ty 
   */
  drawColBorder(x: number, sy: number, ty: number) {
    const {
      ctx,
      options: { borderColor, borderWidth },
    } = this;
    ctx.beginPath();
    ctx.moveTo(x, sy);
    ctx.lineTo(x, ty);
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.stroke();
  }

  /**
   * 绘制水平分割线
   * @param sx startX
   * @param ex endX
   * @param y 
   */
  drawRowBorder(sx: number, ex: number, y: number) {
    const {
      ctx,
      options: { borderColor, borderWidth },
    } = this;

    ctx.beginPath();
    ctx.moveTo(sx, y);
    ctx.lineTo(ex, y);
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.stroke();
  }

  /**
   * 绘制外围边框
   */
  drawOuterBorder() {
    const {
      ctx,
      tableWidth,
      tableHeight,
      x,
      y,
      options: { borderColor },
    } = this;
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, tableWidth, tableHeight);
  }

  /**
   * 检测是否会在画布中
   * @param row 
   * @param cellData 
   * @param cellIdx 
   * @returns 
   */
  isDataInCanvas(row, cellData, cellIdx) {
    const {
      tableData: { th },
    } = this;

    return (
      this.isPointInCanvas(this.x + cellData.x, this.y + row.y) ||
      this.isPointInCanvas(
        this.x + cellData.x + th.width[cellIdx],
        this.y + row.y + row.height,
      )
    );
  }

  /**
   * 绘制排序按钮
   * @param x 
   * @param y 
   * @param order -1 正序 1 倒序
   * @returns 
   */
  drawSortArrow(x: number, y: number, order = 0) {
    const {
      ctx,
      options: { sort },
    } = this;
    if (!sort) {
      return;
    }
    ctx.save();
    ctx.fillStyle = order === -1 ? '#478CE9' : '#C6C8CD';
    ctx.beginPath();
    ctx.moveTo(x - 18, y + 5);
    ctx.lineTo(x - 10, y + 5);
    ctx.lineTo(x - 14, y);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = order === 1 ? '#478CE9' : '#C6C8CD';
    ctx.moveTo(x - 18, y + 10);
    ctx.lineTo(x - 10, y + 10);
    ctx.lineTo(x - 14, y + 15);
    ctx.fill();
    ctx.restore();
  }

  isPointInCanvas(x, y) {
    if (x < 0 || y < 0 || x > this.canvasWidth || y > this.canvasHeight) {
      return false;
    }
    return true;
  }

  /**
   * 绘制斑马纹
   * @param row td
   * @param rowIdx 
   */
  drawStripe(row: tdType, rowIdx: number) {
    const {
      ctx,
      x,
      y,
      options: { cell, stripe, stripeColor },
    } = this;
    if (stripe && rowIdx % 2 !== 0) {
      ctx.fillStyle = stripeColor;
      ctx.fillRect(x, y + row.y, this.tableWidth, row.height);
      ctx.fillStyle = cell.color;
    }
  }

  /** 绘制被点击单元格高亮边框 */
  drawClickRect() {
    const { ctx } = this;
    if (this.clickRect) {
      const { x: clickX, y: clickY, width, height } = this.clickRect;
      if (
        this.isPointInCanvas(this.x + clickX, this.y + clickY) ||
        this.isPointInCanvas(this.x + clickX + width, this.y + clickY + height)
      ) {
        ctx.strokeStyle = '#3A714A';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x + clickX, this.y + clickY, width, height);
      }
    }
  }

  /**
   * 绘制单元格
   * @param row 
   * @returns 
   */
  drawCell(row: tdType) {
    const {
      ctx,
      x,
      y,
      tableData: { th },
    } = this;
    const scrollWidth = Math.abs(this.x);
    for (
      let j = this.startCellIdx || 0,
        rowDataLen = this.endCellIdx || row.data.length;
      j < rowDataLen;
      j++
    ) {
      const data = row.data[j];
      const cellIdx = j;
      // 绘制区域限制在画布内，以提升性能
      if (scrollWidth >= data.x + th.width[cellIdx]) {
        // 终止本次循环
        continue;
      }
      if (typeof this.startCellIdx === 'undefined') {
        this.startCellIdx = j;
      }
      if (data.x >= scrollWidth + this.canvasWidth) {
        this.endCellIdx = j;
        // 终止整个循环
        break;
      }

      const itemData = data;

      if (!itemData.text) {
        itemData.text = this.textOverflow(itemData.fullText, cellIdx);
      }

      ctx.fillText(itemData.text, x + itemData.tx, y + itemData.ty);

      if (cellIdx === row.length! - 1) {
        return;
      }

      this.drawColBorder(
        x + (row.data[cellIdx + 1] || data).x,
        y + row.y,
        y + row.y + row.height,
      );
    }
  }

  /**
   * 绘制整个table(api)
   */
  renderTable() {
    this.clearTable();

    const {
      columns,
      ctx,
      x,
      y,
      options: { head, cell },
      sortInfo,
      tableData: { th, td },
    } = this;
    const scrollHeight = Math.abs(this.y);

    // 绘制table body
    ctx.font = `${cell.fontWeight} ${cell.fontSize}px ${cell.fontFamily}`;
    ctx.fillStyle = cell.color;
    // 根据textAlign设置绘制字体的布局
    ctx.textAlign = cell.textAlign;
    ctx.textBaseline = 'top';

    this.startCellIdx = undefined;
    this.endCellIdx = undefined;

    for (let i = 0, len = td.length; i < len; i++) {
      const row = td[i];
      const rowIdx = i;

      const rowY = row.y;
      const nextY = (td[rowIdx + 1] || row).y;

      // 绘制区域限制在画布内，以提升性能
      if (scrollHeight >= nextY) {
        // 终止本次循环
        continue;
      }

      if (rowY >= scrollHeight + this.canvasHeight) {
        // 终止整个循环
        break;
      }
      // 绘制斑马纹
      this.drawStripe(row, rowIdx);
      // 绘制单元格
      this.drawCell(row);
      // 绘制分割线(border-top)
      this.drawRowBorder(x, this.tableWidth, y + row.y);
    }
    // 绘制外围边框：绘制矩形
    this.drawOuterBorder();
    // 这里给th绘制下边框，这里重复绘制了，对于第一个row的y值会和th.height值一样
    this.drawRowBorder(
      x,
      this.tableWidth,
      head.fix ? th.height : y + th.height,
    );

    // 绘制被点击单元格高亮边框
    this.drawClickRect();

    // 绘制table head
    ctx.font = `${head.fontWeight} ${head.fontSize}px ${head.fontFamily}`;
    ctx.fillStyle = head.color;
    ctx.textAlign = head.textAlign;

    if (head.fix || scrollHeight < th.height) {
      // 绘制背景
      ctx.fillStyle = head.backgroundColor;
      ctx.fillRect(x, head.fix ? 0 : y, this.tableWidth, th.height - 1);
      // 绘制文本
      ctx.fillStyle = head.color;

      for (
        let k = this.startCellIdx || 0,
          colLen = this.endCellIdx || columns.length;
        k < colLen;
        k++
      ) {
        const index = k;
        const fY = head.fix ? th.data[index].ty : y + th.data[index].ty;
        ctx.fillText(th.data[index].text, x + th.data[index].tx, fY);

        // 排序按钮
        this.drawSortArrow(
          x + th.data[index].x + th.width[index],
          fY,
          sortInfo.col === index ? sortInfo.order : 0,
        );

        if (index !== columns.length - 1) {
          this.drawColBorder(
            x + th.data[index + 1].x,
            0,
            head.fix ? th.height : y + th.height,
          );
        }
      }
    }

    self.postMessage({
      tableData: this.tableData,
      hideLoading: true,
    });
  }

  /** 绘制表格(这里用requestAnimation下一次浏览器重绘时绘制) */
  drawTable() {
    requestAnimationFrame(this.renderTable.bind(this));
  }

  /**
   * dpr适配
   */
  adaptDpr() {
    const { canvas, ctx, dpr } = this;
    canvas.width = this.canvasWidth * dpr;
    canvas.height = this.canvasHeight * dpr;
    ctx.scale(dpr, dpr);
  }
}

let aLisseTable: LisseTableOffscreenCanvas;

// 接收主线程数据
self.addEventListener('message', (evt) => {
  const {
    canvas,
    canvasHeight,
    canvasWidth,
    clientRect,
    appendData,
    clickRect,
    moveOffset,
    updateData,
    sortIndex,
  } = evt.data;
  function resizeTable() {
    if (!canvas) {
      aLisseTable.resize({ canvasWidth, canvasHeight });
    }
  }
  const dealFns = {
    canvas: () => {
      aLisseTable = new LisseTableOffscreenCanvas(canvas, evt.data);
      aLisseTable.createTable();
    },
    clientRect: () => {
      aLisseTable.updateTable(...clientRect);
    },
    clickRect: () => {
      aLisseTable.setClickRect(clickRect);
      aLisseTable.updateTable();
    },
    appendData: () => {
      aLisseTable.processData(appendData, true);
    },
    updateData: () => {
      aLisseTable.updateData(updateData);
    },
    moveOffset: () => {
      aLisseTable.changeColsWidth(moveOffset);
    },
    sortIndex: () => {
      aLisseTable.sortData(sortIndex);
    },
    canvasHeight: resizeTable,
    canvasWidth: resizeTable,
  }
  Object.keys(evt.data).forEach((item) => {
    const dealFn = dealFns[item];
    if (typeof dealFn === 'function') {
      dealFn();
    }
  });
});
