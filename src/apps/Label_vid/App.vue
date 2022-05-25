<template>
  <div> 
  <div id="room" class="darkwall">
  <div class="spacer-side">
  <br>
<!--<Title v-bind:msg="title" />-->
	<div class="squareoff labelVid">
    <span xr-layer @click="linkClick" class="xrlink alink">
      <a v-bind:href="'' + link" target="_blank"> {{ title }} </a>
    </span>
  </div>
  </div>
  </div>
  </div> 
</template>

<script setup>
import { inject } from 'vue'


import Title from '../../components/CenterTitle.vue'

import "../../assets/top.css"
import "../../assets/room.css"


let params = inject("params")
var title = params && params.parameter1 ? params.parameter1 : "Click here to learn more"
var link = params && params.parameter2 ? params.parameter2 : "https://www.google.com/"

</script>

<style scoped>

</style>
