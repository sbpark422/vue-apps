<template>
  <div> 
  <div id="room" class="darkwall">
 <div class="spacer-side">
  <Title msg="Cybersickness and the negation of presence" />
	<div class="squareoff">
  <br><br>
   The term cybersickness, or visually induced motion sickness, has been coined to describe symptoms including headache, nausea, eye strain, dizziness, fatigue, or even vomiting that may occur during or after exposure to a virtual environment. Cybersickness is visceral evidence that VR is not the medium to end all media. Cybersickness reminds the susceptible user of the medium in a powerful way. Nausea replaces astonishment.  
   <br/>
   <br/>
   <div style="float:right">
   <span xr-layer @click="linkClick" class="xrlink alink"><a href="https://vrrollercoaster.app/webvr/" target="_blank" id="Cybersickness_link">Click here to ride the WebVR RollerCoaster</a></span></div>

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
