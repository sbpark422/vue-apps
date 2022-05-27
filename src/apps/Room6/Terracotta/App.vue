<template>
  <div> 
  <div id="room" class="darkwall">
  <div class="spacer-side">
  <Title msg="Terracotta Warriors AR" />
  <br><br>
	<div class="squareoff">The Franklin Institute in Philadelphia offered a mobile AR experience for their Terracotta Warrior exhibition. The app allowed visitors to use their smartphones to scan items and view various AR content to learn  more about the history behind the clay soldiers.
  <br /><br />
  <span xr-layer @click="linkClick" class="xrlink alink" id="Terracotta_link"><a href="https://www.youtube.com/watch?v=9advEusJB_Y&t=13s&ab_channel=CGTN" target="_blank">Click here to learn more about the video</a></span>

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
