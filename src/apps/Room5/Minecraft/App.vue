<template>
  <div id="room" class="lightwall">
  <div class="squareoff">
  <Title msg="Minecraft VR" />
  <br />
	 Minecraft VR is a fully immersive, 
      headset version of the sandbox game that already runs on computers, game consoles, and mobile devices. 
      It is called a "sandbox game" because it provides an independent environment in which 
      players can make their own structures and objects out of virtual, LEGO-like blocks.
      <br/><br/>
      Explore the Minecraft-like world  
      <br/>
      <span xr-layer @click="linkClick" class="xrlink alink"><a href="https://blocks.gatunes.com/" target="_blank"> in VRBlocks</a></span>

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
