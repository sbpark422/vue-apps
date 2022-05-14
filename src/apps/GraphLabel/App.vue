<template>
  <div> 
  <div id="room" class="darkwall" :style="style">
<!--<Title v-bind:msg="title" />-->
	<div class="titleStyle ">{{ title }}</div> 
  </div>
  </div> 
</template>

<script setup>
import { inject } from 'vue'


import Title from '../../components/CenterTitle.vue'

import "../../assets/top.css"
import "../../assets/room.css"


let params = inject("params")
var title = params && params.text ? params.text : "Text not set for GraphLabel"
var color = params && params.color ? "color: " + params.color + ";" : "color: red;"
var size = params && params.size ? "font-size: " + params.size + "em;" : "font-size: 2em;"
var style = color + size + "white-space: nowrap;"
</script>

<style scoped>

</style>
