<template>
  <RouterView />
</template>
<script lang="ts" setup>
import { watch, reactive } from 'vue';
/** 测试监听数组变化 */
const r = reactive<any[]>([{
  name: 1
}, {
  name: 2
}]);
watch(() => r, (v1, v2) => {
  if (v2) {
    console.log(v2[0].name);
  }
  console.log(v1[0].name);
},{
  deep:true,
  immediate: true
})
setTimeout(() => {
  r[0].name = 4;
})
setTimeout(() => {
  r.pop();
}, 200);
</script>