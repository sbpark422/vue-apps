<template>
  <div> 
  <div id="room" class="darkwall">
  <div class="spacer-side">
  <Title msg="Richie's Plank Experience" />
  <br>
	<div class="squareoff">Commercial VR experience that is close to the pit experiment.
  <br />
  <br />
  <div style="float: right;">
<span xr-layer @click="linkClick" class="xrlink alink" id="Plank_link"><a href="https://www.youtube.com/watch?v=faNsP7ExSt0" target="_blank">Click here to learn more about the video</a></span>
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

