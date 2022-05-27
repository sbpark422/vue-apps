<template>
  <div> 
  <div id="room" class="darkwall">
  <div class="spacer-side">
  <Title msg="The future of news?" />
  <br>
  <br>
  <div>
	<div class="squareoff">Nonnie de la Peña's Ted Talk called  'The future of news?' introduces a new form of journalism where Virtual Reality technology is used to put audience inside the stories. In her work, she created VR stories about imprisonment in Guantanamo and hunger in Los Angeles to induce empathy in the audience.
   <br /> <br /> <br />
    <span xr-layer @click="linkClick" class="xrlink alink" id="Nonnie_link"><a href="https://www.ted.com/talks/nonny_de_la_pena_the_future_of_news_virtual_reality?language=en" target="_blank">Click here to learn more about the video</a></span>
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
