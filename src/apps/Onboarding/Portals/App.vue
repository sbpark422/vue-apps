<template>
  <div> 
  <div id="room" class="darkwall">
  <div class="spacer-side">
  <Title msg="Portals" />
  	
  <br />
  <div xr-layer>
    <img class="img_Hover" src="../../../assets/images/Onboarding/portals.png" height="200">
  </div>
  <br />
<div class="squareoff">
  There are three kinds of portals:  <div style="padding: 5px 30px;">
  <span style="color:#4A90E2; fontWeight:700;">Blue</span> portals transport you instantly to nearby galleries.
 <br/>
  <span style="color:#D0021B; fontWeight:700;">Red</span> portals also transport you to other galleries, but require you to choose your avatar and join again.<br/>
  <span style="color:#7ED321; fontWeight:700;">Green</span> portals transport you to our 2D webpage.
  </div>
</div>
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
