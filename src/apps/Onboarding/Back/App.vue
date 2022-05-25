<template>
  <div> 
  <div id="room" class="darkwall">
  <div >
    <span xr-layer @click="linkClick" class="xrlink alink"><a href="https://realitymedia.digital/" target="_blank" style="fontSize:1.5em;">Click here to return back to the website.</a></span>

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
