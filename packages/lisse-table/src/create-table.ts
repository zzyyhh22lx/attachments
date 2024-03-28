import OffscreenCanvasWorker from './offscreen-canvas.ts?worker';
import { mergeDeep, throttle } from './utils';
import { defaultOptions } from './default-options';

/**
 * @class LisseTable
 * @description Generate table width offscreenCanvas or canvas.
 */
export class LisseTable {
  canvas: HTMLCanvasElement;
  data: any;
  columns: any;
  colTypes: any;
  toolCanvas: HTMLCanvasElement;
  toolCanvasCtx: any;
  options: any;
  x: number;
  y: number;
  tableWidth: number;
  tableHeight: number;
  waterMarkerCanvas: any;
  eleClientRect: {};
  ctxMenuShow: boolean;
  tableData: any;
  move: { target: any; ongoing: boolean; startX: number; originValue: number; index: number; range: number; };
  wrapperEle: any;
  lisseLoadingEle: any;
  innerEle: any;
  scrollerEle: any;
  tipsEle: any;
  tipsInnerEle: any;
  dragBoxEle: any;
  wmCanvasElm: any;
  canvasWidth: number;
  canvasHeight: number;
  worker: any;
  dpr: number;
  dragMoveEvtHandler: (...arg: any[]) => void;
  dragUpEvtHandler: () => void;
  /**
   * @constructor
   * @param {HTMLCanvasElement} canvas - The canvas element.
   * @param {object} config - The Config options.
   */
  constructor(canvas, config) {
    this.canvas = canvas;

    this.initOpt(config);

    this.initDom();

    this.setCanvasSize();

    this.registerEvent();
  }

  // options初始化
  initOpt(config) {
    const { data = [], columns = [], colTypes = [], options } = config;
    this.data = data;
    this.columns = columns;
    this.colTypes = colTypes;
    this.toolCanvas = document.createElement('canvas');
    this.toolCanvasCtx = this.toolCanvas.getContext('2d');
    this.options = mergeDeep(defaultOptions, options || {});
    this.x = 0;
    this.y = 0;
    this.tableWidth = 0;
    this.tableHeight = 0;
    this.waterMarkerCanvas = null;
    this.eleClientRect = {};
    this.ctxMenuShow = false;
    this.tableData = {
      th: {
        width: [],
        data: [],
      },
      td: [],
    };
    this.move = {
      target: null,
      ongoing: false,
      startX: 0,
      originValue: 0,
      index: 0,
      range: 0,
    };
  }

  initDom() {
    this.wrapperEle = document.querySelector('#lisse-table-wrapper');
    this.lisseLoadingEle = this.wrapperEle.querySelector('#lisse-loading');
    this.innerEle = this.wrapperEle.querySelector('#lisse-table-inner');
    this.scrollerEle = this.wrapperEle.querySelector('#lisse-table-scroller');
    this.tipsEle = this.wrapperEle.querySelector('#lisse-text-tips');
    this.tipsInnerEle = this.tipsEle.querySelector(
      '.lisse-text-tips-inner span',
    );
    this.dragBoxEle = this.wrapperEle.querySelector('#lisse-drag-box');
    this.wmCanvasElm = this.wrapperEle.querySelector('#lisse-water-marker');
  }

  // 设置Canvas尺寸
  setCanvasSize() {
    const getWrapperStyle = window.getComputedStyle(this.wrapperEle, null);
    const wpWidth = parseFloat(getWrapperStyle.getPropertyValue('width'));
    const wpHeight = parseFloat(getWrapperStyle.getPropertyValue('height'));
    [this.eleClientRect] = this.innerEle.getClientRects();
    this.scrollerEle.style.width = `${wpWidth}px`;
    this.canvasWidth = wpWidth;
    this.canvasHeight = wpHeight;
  }

  resize() {
    this.showLoading();
    this.setCanvasSize();
    this.worker.postMessage({
      canvasHeight: this.canvasHeight,
      canvasWidth: this.canvasWidth,
    });

    // dpr适配
    this.adaptDpr();

    // 绘制水印
    this.drawWaterMarker();
    setTimeout(this.hideLoading.bind(this), 20);
  }

  // 创建Table
  createTable() {
    // 能力检测
    if (typeof OffscreenCanvas === 'undefined') {
      console.error('请使用Chrome浏览器~');
      return;
    }

    this.showLoading();
    this.adaptDpr();

    const {
      data,
      columns,
      colTypes,
      options,
      dpr,
      options: { waterMarker },
    } = this;

    // 将控制转移到一个OffscreenCanvas对象上
    const offscreenCanvas = this.canvas.transferControlToOffscreen();

    if (waterMarker.enable) {
      // 生成水印信息
      this.createWaterMarker();
    }

    // 创建一个新线程
    this.worker = new OffscreenCanvasWorker();

    // 传入worker线程
    this.worker.postMessage(
      {
        canvas: offscreenCanvas,
        data,
        columns,
        colTypes,
        options,
        dpr,
        canvasHeight: this.canvasHeight,
        canvasWidth: this.canvasWidth,
      },
      [offscreenCanvas],
    );

    // 接收worker线程消息
    this.worker.addEventListener('message', this.messageHandler.bind(this));

    // 绘制水印
    this.drawWaterMarker();
  }

  messageHandler(event) {
    const {
      options: {
        column: { adjust },
      },
    } = this;

    const { data: evtData = {} } = event;

    Object.keys(evtData).forEach((item) => {
      const dealFn = {
        tableHeight: () => {
          this.scrollerEle.style.height = `${evtData.tableHeight}px`;
        },
        tableWidth: () => {
          this.scrollerEle.style.width = `${evtData.tableWidth}px`;
        },
        tableData: () => {
          this.hideLoading();
          this.tableData.th = evtData.tableData.th || {};
          this.tableData.td = evtData.tableData.td || [];

          [this.eleClientRect] = this.innerEle.getClientRects();

          if (adjust) {
            // 创建DOM网格便于拖动调整列宽
            this.createDragGrid();
          }
        },
        hideLoading: () => {
          this.hideLoading();
        },
      }[item];

      if (typeof dealFn === 'function') {
        dealFn.apply(this);
      }
    });
  }

  updateTable(x = 1, y = 1) {
    this.x = x;
    this.y = y;
    this.worker.postMessage({ clientRect: [x, y] });
  }

  updateData(updateData) {
    this.worker.postMessage({ updateData });
  }

  // 生成水印信息
  createWaterMarker() {
    const {
      options: { waterMarker },
    } = this;
    if (!waterMarker.enable || !waterMarker.text) {
      return;
    }
    const waterMarkerText = waterMarker.text.substring(
      0,
      waterMarker.textMaxLen,
    );
    this.waterMarkerCanvas = document.createElement('canvas');
    const waterMarkerCtx = this.waterMarkerCanvas.getContext('2d');
    this.waterMarkerCanvas.width = waterMarker.cellWidth;
    this.waterMarkerCanvas.height = waterMarker.cellHeight;
    waterMarkerCtx.rotate(waterMarker.rotateDeg);
    waterMarkerCtx.font = `${waterMarker.fontWeight} ${waterMarker.fontSize}px ${waterMarker.fontFamily}`;
    waterMarkerCtx.fillStyle = waterMarker.color;
    waterMarkerCtx.textAlign = waterMarker.textAlign;
    waterMarkerCtx.textBaseline = waterMarker.textBaseline;
    waterMarkerCtx.fillText(
      waterMarkerText,
      waterMarker.textPosX,
      waterMarker.textPosY,
    );
  }

  // 绘制水印
  drawWaterMarker() {
    const {
      wrapperEle,
      options: { waterMarker },
    } = this;
    if (!waterMarker.enable || !waterMarker.text) {
      return;
    }

    if (this.wmCanvasElm) {
      this.wmCanvasElm
        .getContext('2d')
        .clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    } else {
      this.wmCanvasElm = document.createElement('canvas');
      this.wmCanvasElm.id = 'lisse-water-marker';
      this.wmCanvasElm.style.position = 'fixed';
      this.wmCanvasElm.style.pointerEvents = 'none';
      wrapperEle.insertBefore(this.wmCanvasElm, this.canvas);
    }

    this.wmCanvasElm.width = this.canvasWidth;
    this.wmCanvasElm.height = this.canvasHeight;

    const waterMarkerCanvasCtx = this.wmCanvasElm.getContext('2d');

    const pattern = waterMarkerCanvasCtx.createPattern(
      this.waterMarkerCanvas,
      'repeat',
    );
    waterMarkerCanvasCtx.fillStyle = pattern;
    waterMarkerCanvasCtx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  // dpr适配
  adaptDpr() {
    const { canvas } = this;
    this.dpr = window.devicePixelRatio || 1;
    canvas.style.width = `${this.canvasWidth}px`;
    canvas.style.height = `${this.canvasHeight}px`;
  }

  // 展示悬浮提示
  showTxtTip(x, y, text) {
    if (!text) {
      return;
    }
    this.tipsEle.style.left = `${x}px`;
    this.tipsEle.style.top = `${y}px`;
    this.tipsInnerEle.innerText = text;
    this.tipsEle.style.display = 'inline-block';
    this.setTxtTipDirection(y);
  }

  setTxtTipDirection(y) {
    const {
      tableData: { td },
    } = this;
    if (
      this.canvasHeight - this.tipsEle.offsetTop <
      this.tipsEle.offsetHeight
    ) {
      this.tipsEle.style.top = `${y -
        td[0].height -
        this.tipsEle.offsetHeight}px`;
      this.tipsEle.classList.add('place-top');
    } else {
      this.tipsEle.classList.remove('place-top');
    }
  }

  // 右键菜单状态
  setCtxMenuStatus(status) {
    if (status) {
      this.ctxMenuShow = true;
      return;
    }
    setTimeout(() => {
      this.ctxMenuShow = false;
    }, 200);
  }

  // 关闭悬浮提示
  hideTxtTip() {
    this.tipsEle.style.display = 'none';
  }

  // 创建用于拖动改变列宽的DOM结构
  createDragGrid() {
    const {
      dragBoxEle,
      tableData: { th },
    } = this;

    dragBoxEle.innerHTML = th.width.reduce(
      (acc, cur, index) =>
        `${acc}<div class="lisse-drag-grid" style="margin-left:${cur -
          5}px;" data-index="${index}"></div>`,
      '',
    );
  }

  // 滚动事件处理函数
  scrollEvtHandler(e) {
    window.requestAnimationFrame(() => {
      this.updateTable(-e.target.scrollLeft, -e.target.scrollTop);
      this.hideTxtTip();
    });
  }

  // 点击事件处理函数
  clickEvtHandler(e) {
    const {
      innerEle,
      eleClientRect,
      move,
      options: { head, sort },
      tableData: { th },
    } = this;

    if (move.ongoing) {
      return;
    }

    const posX = e.clientX - eleClientRect.x + innerEle.scrollLeft;
    const posY = e.clientY - eleClientRect.y + innerEle.scrollTop;

    // 获取点击位置单元格数据
    const { data = {}, row = {}, dataIndex = 0 } =
      this.getDataByPos(posX, posY) || {};

    // 鼠标右键
    if (e.button === 2) {
      const lisseTblCtxMenuEvt = new CustomEvent('lisseTblCtxMenuEvt', {
        detail: {
          data,
          row,
          dataIndex,
          x: data.x,
          y: row.y,
        },
      });
      document.dispatchEvent(lisseTblCtxMenuEvt);
    }

    // 点击位于head区域
    if (
      (head.fix && e.clientY - eleClientRect.y < th.height) ||
      (!head.fix && posY < th.height)
    ) {
      if (sort) {
        this.worker.postMessage({
          sortIndex: dataIndex,
        });
        this.showLoading();
      }
      return;
    }

    this.worker.postMessage({
      clickRect: {
        x: data.x,
        y: row.y,
        width: th.width[dataIndex],
        height: row.height,
      },
    });
  }

  // 获取指定坐标对应的单元格数据
  getDataByPos(posX, posY) {
    const {
      innerEle,
      options: { head },
      tableData: { td, th },
    } = this;

    let result = {};

    td.some((row, rowIndex) => {
      let rowData = row.data || [];
      let rowInfo = mergeDeep({}, row);

      if (
        (head.fix && th.height > posY - innerEle.scrollTop) ||
        (!head.fix && td[0] && td[0].y > posY)
      ) {
        rowData = th.data || [];
        rowInfo = mergeDeep({}, th);
        rowInfo.y = 0;
      }

      if (
        (posY > rowInfo.y && posY < rowInfo.y + row.height) ||
        (!head.fix && posY > 0 && posY < row.height) ||
        (head.fix && th.height > posY - innerEle.scrollTop)
      ) {
        rowData.some((data, dataIndex) => {
          const rst = { row: rowInfo, rowIndex, hover: false };
          if (posX > data.x && posX < data.x + th.width[dataIndex]) {
            result = { ...rst, data, dataIndex };
            return true;
          }
          return false;
        });
        return true;
      }
      return false;
    });

    return result;
  }

  mouseoutEvtHandler(e) {
    if (
      e.target.id === 'lisse-drag-box' ||
      e.target.id === 'lisse-text-tips' ||
      e.target.classList.contains('lisse-text-tips-inner') ||
      e.target.classList.contains('lisse-text-tips-span')
    ) {
      return;
    }

    // setTimeout(()=>{
    this.hideTxtTip();
    // },100);
  }

  mousemoveEvtHandler(e) {
    const {
      innerEle,
      eleClientRect,
      move,
      options: { showTextTip, head },
      tableData: { th },
    } = this;

    if (head.fix && e.clientY - eleClientRect.y < th.height) {
      this.hideTxtTip();
      return;
    }

    const posX = e.clientX - eleClientRect.x + innerEle.scrollLeft;
    const posY = e.clientY - eleClientRect.y + innerEle.scrollTop;

    // 鼠标悬停弹窗提示完整的单元格信息
    const { data = {}, row = {}, dataIndex = 0 } =
      this.getDataByPos(posX, posY) || {};

    const dataText = String(typeof data.text === 'undefined' ? '' : data.text);
    const dataFullText = String(
      typeof data.fullText === 'undefined' ? '' : data.fullText,
    );

    // if (
    //   move.ongoing ||
    //   !showTextTip ||
    //   this.ctxMenuShow ||
    //   !(dataFullText && dataText)
    // ) {
    //   this.hideTxtTip();
    //   return;
    // }

    if (move.ongoing || !showTextTip || this.ctxMenuShow) {
      this.hideTxtTip();
      return;
    }

    // if (
    //   textOverTip &&
    //   !(/\.{3}$/.test(dataText) && dataFullText.length > dataText.length - 3)
    // ) {
    //   this.hideTxtTip();
    //   return;
    // }

    this.showTxtTip(
      data.x - innerEle.scrollLeft + th.width[dataIndex] / 2,
      row.y + row.height - innerEle.scrollTop,
      dataFullText || dataText,
    );
  }

  // 鼠标拖拽边框事件
  dragMouseDownEvtHandler(e) {
    if (e.target.className !== 'lisse-drag-grid') {
      return;
    }
    const { innerEle, eleClientRect, move } = this;
    move.target = e.target;
    const posX = e.clientX - eleClientRect.x + innerEle.scrollLeft - 5;

    move.target.classList.add('moving');
    this.hideTxtTip();
    move.ongoing = true;
    move.startX = posX;
    move.originValue = parseFloat(move.target.style.marginLeft);
    move.index = parseInt(move.target.getAttribute('data-index'), 10);

    this.dragMoveEvtHandler = throttle(
      this.dragMousemoveEvtHandler.bind(this),
      30,
    );

    this.dragUpEvtHandler = this.dragMouseUpEvtHandler.bind(this);
    document.addEventListener('mousemove', this.dragMoveEvtHandler);
    document.addEventListener('mouseup', this.dragUpEvtHandler);
  }

  dragMousemoveEvtHandler(e) {
    const { innerEle, eleClientRect, move } = this;
    const posX = e.clientX - eleClientRect.x + innerEle.scrollLeft - 5;
    move.range = posX - move.startX;
    move.target.style.marginLeft = `${move.originValue + move.range}px`;
  }

  dragMouseUpEvtHandler() {
    const {
      toolCanvasCtx,
      move,
      options: { head },
    } = this;

    document.removeEventListener('mousemove', this.dragMoveEvtHandler);
    document.removeEventListener('mouseup', this.dragUpEvtHandler);

    // 设置字体相关参数，用于measureText方法测量文本宽度
    toolCanvasCtx.font = `${head.fontWeight} ${head.fontSize}px ${head.fontFamily}`;

    // 拖动后的列宽如果小于文字宽度，则返回拖动前的位置
    if (
      this.tableData.th.width[move.index] + move.range <
      toolCanvasCtx.measureText(this.tableData.th.data[move.index].text).width
    ) {
      move.target.style.marginLeft = `${move.originValue}px`;
    } else {
      this.showLoading();

      this.worker.postMessage({
        moveOffset: {
          index: move.index,
          value: move.range,
        },
      });
    }

    move.target.classList.remove('moving');

    setTimeout(() => {
      move.ongoing = false;
    }, 200);

    move.startX = 0;
    move.range = 0;
  }

  // 事件注册
  registerEvent() {
    const {
      options: {
        showTextTip,
        column: { adjust },
      },
    } = this;

    window.addEventListener('resize', this.resize.bind(this));
    window.addEventListener('beforeunload', this.destroy.bind(this));

    this.innerEle.addEventListener('scroll', this.scrollEvtHandler.bind(this));
    this.innerEle.addEventListener('click', this.clickEvtHandler.bind(this));

    document.addEventListener('contextmenu', this.clickEvtHandler.bind(this));

    // 悬浮弹窗事件注册
    if (showTextTip) {
      this.innerEle.addEventListener(
        'mousemove',
        throttle(this.mousemoveEvtHandler.bind(this), 300),
      );
      this.wrapperEle.addEventListener(
        'mouseout',
        this.mouseoutEvtHandler.bind(this),
      );
    }

    if (adjust) {
      // 拖动改变列宽相关事件
      this.dragBoxEle.addEventListener(
        'mousedown',
        this.dragMouseDownEvtHandler.bind(this),
      );
    }
  }

  // 新增数据
  appendData(data) {
    this.worker.postMessage({ appendData: data });
  }

  showLoading() {
    this.lisseLoadingEle.style.display = 'block';
  }

  hideLoading() {
    this.lisseLoadingEle.style.display = 'none';
  }

  // 销毁
  destroy() {
    try {
      if (this.worker) {
        this.worker.terminate();
      }
      // this.canvas = null;
      window.removeEventListener('resize', this.resize.bind(this));
      if (this.wmCanvasElm.parentNode) {
        this.wmCanvasElm.parentNode.removeChild(this.wmCanvasElm);
      }
      this.dragBoxEle.innerHTML = '';
    } catch (e) {
      console.log(e);
    }
  }
}
