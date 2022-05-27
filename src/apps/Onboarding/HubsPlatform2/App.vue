<template>
  <div> 
  <div id="room" class="darkwall">
  <div class="spacer">
    <div class="squareoff">
<div class="keyPoint">To enter the room:</div>
<br>
- On a desktop or mobile device, follow the prompts to select a name/avatar and enable the mic.
<br>
- On a VR headset, if you opened the URL on your desktop or smartphone, choose "Enter on Standalone VR" to create a code that makes it easy to open on your standalone headset. Open the browser in your VR headset, navigate to hubs.link and enter the code.
<br><br>
<div>
<div class="keyPoint">To navigate in Hubs:</div>  
<br>
- On desktop use your WASD or arrow keys to move around. You can also press your right mouse button to teleport to a different location. Rotate your view using the Q and E keys, or hold down your left mouse button and drag.
<br>
-For Quest VR devices, <br/><br/>
<span style="padding-left:50px">
   <img xr-layer @click="linkClick" src="../../../assets/images/Onboarding/controllers.jpg" height="150" id="HubsPlatform_link2">
</span>
<br/>
For other controls and devices, see the <span xr-layer @click="linkClick" class="xrlink alink" id="HubsPlatform_link3"><a href="https://hubs.mozilla.com/docs/hubs-controls.html#oculus-touch-controls" target="_blank">list of Hubs controls.</a></span><br/>
 </div>
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