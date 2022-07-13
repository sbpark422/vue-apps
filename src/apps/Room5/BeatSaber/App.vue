<template>
  <div id="room" class="lightwall">
  <div class="squareoff">
  <Title msg="Beat Saber" />
  <br />
	  Beat Saber is a VR rhythm game with a little Star Wars thrown in. The player uses lightsabers to keep the beat. 

    Play a similar VR rhythm game
    <br/>
    <span xr-layer @click="linkClick" class="xrlink alink"><a href="https://moonrider.xyz/" target="_blank"> in the Moon Rider</a></span>
    </div> 
  </div>
</template>

<script setup>
import Title from '../../../components/CenterTitle.vue'

import "../../../assets/top.css"
import "../../../assets/room.css"
</script>
import { inject } from 'vue'

import Title from '../../../components/CenterTitle.vue'
import "../../../assets/top.css"
import "../../../assets/room.css"

const linkClick = inject('linkClick')
<style scoped>

</style>
