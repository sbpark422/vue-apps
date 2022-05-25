<template>
  <div> 
  <div id="room" class="darkwall">

   <div class="squareoff"><span xr-layer @click="linkClick" class="xrlink alink"><a href="https://www.youtube.com/watch?v=X9jM4LcwHog&t=55s&ab_channel=FeelVirtual" target="_blank">Click here to visit the website</a></span>
  <br />

  </div>
  </div>
  </div> 
</template>


<script setup>
import { inject } from 'vue'

import Title from '../../../components/CenterTitle.vue'
import "../../../assets/top.css"
import "../../../assets/room.css"

const linkClick = inject('linkClick')
</script>

<style scoped>

</style>
