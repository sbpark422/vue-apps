<template>
  <div> 
  <div id="room" class="darkwall">
  <div class="spacer">

<Title msg="Adjust your Oculus settings" />
<br>
	<div class="squareoff"> To best experience this gallery in Oculus devices, we recommend you to adjust the Hubs setting in your browser. Please first exit the VR mode, and click on the 'more' button on the browser to view the settings.
  <br /> 
  <br />
</div>
   <div xr-layer @click="linkClick" class="xrlink alink_img" style="display: inline-block;" id="HubsPlatform_link">
        <img src="../../../assets/images/setting01.jpg" height="212">
   </div>
   <br />  
   <br />
<div class="squareoff">
   In the misc menu, please enable high resolution and drop shoadow. Now, reload the webpage.  </div>

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

