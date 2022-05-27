<template>
  <div> 
  <div id="room" class="darkwall">
  <div class="spacer-side">
  <Title msg="Presence in AR" />
  <br>
  	<div class="squareoff">
This experiment was inspired by the VR "pit" experiment described on the wall to your left. The subjects wore AR headsets instead of VR ones. They could see the room around them, but the pit itself was still virtual. Would the subjects would feel the same measurable anxiety in AR as in VR? The subjects filled out a questionnaire after the experience and indicated that they did have a feeling of presence, but in this case, unlike in the VR experiment, the physiological data (heart rate etc.) did not indicate a response.
<br><br>
<div class="oblique" style="fontSize:0.9rem;">
Gandy, Maribeth, et al. 2010. “Experiences with an AR Evaluation Test Bed: Presence, Performance, and Physiological Measurement.” In 2010 IEEE International Symposium on Mixed and Augmented Reality, 127–36. Seoul, Korea (South): IEEE. <span xr-layer @click="linkClick" class="xrlink alink" id="ARPit_link"><a href="https://ieeexplore.ieee.org/document/5643560" target="_blank">https://doi.org/10.1109/ISMAR.2010.5643560.</a></span></div>
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
