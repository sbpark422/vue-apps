<template>
  <div> 
  <div id="room" class="ivorywall"> 
  <div style="padding-top: 10px">
  <div class="history_spacer-side">
  <Title class="history_title" msg="Google Street View" />
  
  <p class="history_year">2007</p>
  <hr class="history_hr">
  <br/>
  
<div class="squareoff">
<span xr-layer @click="linkClick" class="xrlink alink"><a href="https://www.google.com/streetview/" target="_blank">Google Street View,</a></span> which was first launched in 2007, provides the user interactive panoramas that are created through stitching photographs together seamlessly. In Google Maps, the user could feel as if they are on the streets of the place they select, looking around the world.
</div>
</div>
	</div>
  <br />
  </div> 
  </div>
</template>

<script setup>
import Title from '../../../components/CenterTitle.vue'

import "../../../assets/top.css"
import "../../../assets/room.css"
</script>

<style scoped>

</style>
