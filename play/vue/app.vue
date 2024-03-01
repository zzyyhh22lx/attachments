<template>
  <div>
    <canvas width="500" height="500" ref="map"></canvas>
    <canvas width="100" height="100" ref="miniMap"></canvas>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { MiniMap } from '@attachments/matting/src/toolkits/extensions/mini-map';
const map = ref();
const miniMap = ref();
onMounted(() => {
  new MiniMap(map.value, {
    width: 500,
    height: 500,
    src: 'https://p6-passport.byteacctimg.com/img/user-avatar/bb3564314012b51810470613ca5ede70~210x210.awebp'
  }, miniMap.value, {
    width: 100,
    height: 100
  });
})
</script>
<style lang="scss" scoped>

</style>
