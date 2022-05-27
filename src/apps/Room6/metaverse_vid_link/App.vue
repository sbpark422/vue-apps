<template>
  <div> 
  <div id="room" class="darkwall">
  <div class="spacer-side">
  <Title msg="Metaverse" />
  <br>
	<div class="squareoff">Mark Zuckerberg has given a glimpse of the “metaverse” - a digital world built over our own, comprising virtual reality headsets and augmented reality.
  <br />
  <br />
  <div style="float: right;">
 <span xr-layer @click="linkClick" class="xrlink alink" id="Metaverse_link"><a href="https://www.youtube.com/watch?v=SAL2JZxpoGY&t=64s&ab_channel=GuardianNews" target="_blank">Click here to learn more about the video</a></span>
  </div>
  </div>


  <!-- In this experience, users find themselves on the threshold of forgetting that we are having a VR experience. Being on that threshold is a sence of presence in a reality medium. -->
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
