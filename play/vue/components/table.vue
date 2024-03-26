<template>
  <div>
    <div id="lisse-table-wrapper">
      <div id="lisse-text-tips">
        <div class="lisse-text-tips-inner">
          <span class="lisse-text-tips-span"></span>
        </div>
      </div>
      <div id="lisse-loading" class="loading" style="display: none"></div>
      <canvas ref="tabled" id="lisse-canvas"></canvas>
      <div id="lisse-table-inner">
        <div id="lisse-table-scroller"><div id="lisse-drag-box"></div></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { LisseTable } from '@attachments/lisse-table';
const tabled = ref();
const data: string[][] = [];
onMounted(() => {
  for(let i = 0; i < 100; i++) {
    data.push(['121333333333333333333333312345', '2', '3', '4']);
  }
  const allDataTable = new LisseTable(tabled.value, {
    data,
    columns: [1,2,3,4]
  })
  allDataTable.createTable();
})
</script>
<style scoped>
#lisse-table-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  scroll-behavior: smooth;
  transform: translateZ(0);
}
#lisse-canvas {
  position: absolute;
  top: 0;
  left: 0;
}
#lisse-table-inner {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: overlay;
  scroll-behavior: smooth;
  overscroll-behavior: contain;
  will-change: scroll-position;
  transform: translateZ(0);
}
#lisse-table-scroller {
  position: relative;
}
#lisse-text-tips {
  position: absolute;
  top: 0;
  left: 0;
  min-width: 120px;
  max-width: 300px;
  min-height: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: #ffffff;
  border-radius: 5px;
  padding: 5px 7px 0;
  transform: translateX(-50%);
  text-align: center;
  z-index: 1;
  display: none;
}
#lisse-text-tips::before {
  position: absolute;
  top: -10px;
  left: 50%;
  margin-left: -10px;
  content: '';
  height: 10px;
  width: 20px;
  opacity: 0.8;
  background: url("data:image/svg+xml,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Cpath d='M971.293 639.252L536.846 204.806 102.4 639.252z'/%3E%3C/svg%3E")
    no-repeat;
  background-size: 100% auto;
}
#lisse-text-tips.place-top::before {
  top: auto;
  bottom: -10px;
  transform: rotate(180deg);
}
.lisse-text-tips-inner {
  display: inline-block;
  font-size: 14px;
  text-align: center;
  word-break: break-all;
  max-height: 200px;
  min-width: 120px;
  overflow-y: auto;
  &::-webkit-scrollbar-track-piece {
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.2);
  }
  span {
    text-align: left;
    font-size: 12px;
  }
  a {
    font-size: 12px;
    margin: 2px 5px 2px 6px;
    color: #75ddf1;
    white-space: nowrap;
  }
}
#lisse-drag-box {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  z-index: 10;
  white-space: nowrap;
}
.lisse-drag-grid {
  display: inline-block;
  width: 5px;
  height: 100%;
  cursor: col-resize;
}
.lisse-drag-grid.moving {
  border-right: 1px dashed rgba(92, 92, 92, 0.6);
}
.loading {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background: rgba(255, 255, 255, 0.3) no-repeat center;
  z-index: 1;
}
</style>
