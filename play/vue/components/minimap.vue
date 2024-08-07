<template>
  <div>
    <canvas width="500" height="50000" ref="map"></canvas>
    <canvas width="100" height="10000" ref="miniMap"></canvas>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { BeZierClick } from '@attachments/skin';
const map = ref();
const miniMap = ref();
onMounted(() => {
  new BeZierClick(map.value, {
    width: 500,
    height: 50000,
    src: 'https://p6-passport.byteacctimg.com/img/user-avatar/bb3564314012b51810470613ca5ede70~210x210.awebp'
  }, miniMap.value, {
    width: 100,
    height: 10000
  });
})
</script>
