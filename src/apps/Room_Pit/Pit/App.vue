<template>
  <div> 
  <div id="room">
  <div class="spacer-side">
  <br>
  <Title msg="Pit Experiment" />
  <br>
	<div class="squareoff">The experiments in the Pit Room required subjects to walk along the edges of the virtual pit while carrying an object (a book or a colored block). The physical room was designed to copy the virtual room: the subjects walked on actual wooden board, which they could feel through flimsy slippers that they were wearing. (This is called "passive haptics.")<br /> <br /> The subjects' heart rate, skin conductance, and skin temperature were monitored for changes. The goal was <span style="fontWeight: 700">to establish empirical measures for the subjective feeling of presence.</span> Changes in heart rate proved to be the best physical measure of presence, and the passive haptics were particularly effective. This version of the Pit model was provided by Rick Skarbez, and was used in one of the final sequence of experiments for the Pit researcher.
  <br>
  <br>
  <div class="oblique">R. Skarbez, F. P. Brooks and M. C. Whitton, "Immersion and Coherence: Research Agenda and Early Results," in IEEE Transactions on Visualization and Computer Graphics, vol. 27, no. 10, pp. 3839-3850, 1 Oct. 2021, <br /><br /><span xr-layer @click="linkClick" class="xrlink alink" id="Pit_link1"><a href="https://ieeexplore.ieee.org/abstract/document/9055149" target="_blank">doi: 10.1109/TVCG.2020.2983701.</a></span></div>
  <br>
  <br>
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
