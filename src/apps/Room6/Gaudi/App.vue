<template>
  <div> 
  <div id="room" class="darkwall">
  <div class="spacer-side">
  <Title msg="Gaudí's Casa Batlló with AR" />
  <br>
	<div class="squareoff">"Casa Batlló, one of the masterpieces of Antoni Gaudí, can be experienced with the mobile AR, which visualizes the reconstructed interior and the design inspirations through 3D animations."
  <br/><br/>
  <span xr-layer @click="linkClick" class="xrlink alink"><a href="https://www.youtube.com/watch?v=dye_YVx2VUg&ab_channel=EricAzares" target="_blank" id="Gaudi_link">Click here to learn more about the video</a></span>
  </div>
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
