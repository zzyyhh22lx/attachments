<template>
  <RouterView />
</template>
<script lang="ts" setup>
import { watch, reactive } from 'vue';
/** 测试监听数组变化 */
const r = reactive<number[]>([]);
watch(() => r, (v1, v2) => {
  console.log(v1, v2);
},{
  deep:true
})
setTimeout(() => {
  r.push(1);
})
setTimeout(() => {
  r.push(12);
}, 200);
setTimeout(() => {
  r[0] = 2;
}, 201);
</script>