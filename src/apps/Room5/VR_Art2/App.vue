<template>
  <div> 
  <div id="room" class="lightwall">
  <div class="squareoff">
	 Digital art in general is an extension of multimedia and installation art dating from 
the 1960s, the beginning of the postmodern era, when the scope of possible artistic media was 
expanding to include video and audio technology, along with all sorts of mixed media and found 
objects. In the late 1960s several well-known artists collaborated with engineers in a project 
entitled Experiments in Art and Technology (E.A.T.), promoting the introduction of new media 
technologies into the art world. VR art came later: one of the earliest examples was
<br/>
<span xr-layer @click="linkClick" class="xrlink alink"><a href="https://www.youtube.com/watch?v=s5wEuclfnN0" target="_blank">Jeffrey 
Shaw’s Legible City (1989),</a></span> which showed a 3-D city of words on a giant screen. 
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
