<template>
  <div> 
  <div id="room" class="darkwall">

   <div class="squareoff"><span xr-layer @click="linkClick" class="xrlink alink"><a href="https://www.ted.com/talks/nonny_de_la_pena_the_future_of_news_virtual_reality?language=en" target="_blank">Click here to visit the website</a></span>
  <br />

  </div>
  </div>
  </div> 
</template>

<script setup>
import Title from '../../../components/CenterTitle.vue'

import "../../../assets/top.css"
import "../../../assets/room.css"
</script>

<style scoped>
.middle {
  transition: .5s ease;
  opacity: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  text-align: center;
}
.textx {
  background-color: #04AA6D;
  color: white;
  font-size: 16px;
  padding: 16px 32px;
}
</style>
