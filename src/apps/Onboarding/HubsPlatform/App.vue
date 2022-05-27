<template>
  <div> 
  <div id="room" class="darkwall">
  <div class="spacer">
  <Title msg="The Hubs Platform" />
  <br />
  <div xr-layer @click="linkClick" class="xrlink alink_img" style="display: inline-block;" id="HubsPlatform_link">
      <a href="https://hubs.mozilla.com/docs/welcome.html" target="_blank">
        <img src="../../../assets/images/Onboarding/MozillaHubs.jpg" height="212">
      </a>
   </div>
   <br>
	<div class="squareoff"><em>Realitymedia</em> is built on top of Mozilla's open-source platform. An extensive guide to using Mozilla Hubs is available <span xr-layer @click="linkClick" class="xrlink alink"><a href="https://hubs.mozilla.com/docs/intro-hubs.html" target="_blank">in the Hubs user documentation.</a></span><br><br>
  Here are the highlights:
  <br><br>
Before entering, you are in the room's lobby. From here, you can see and hear what's going on inside the room, but you can only interact with others using text chat. 
<br><br>
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