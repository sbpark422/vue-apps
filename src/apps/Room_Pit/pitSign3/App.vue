<template>
  <div> 
  <div id="room">
  <div class="spacer-side">
  <div class="squareoff">
  <br>
  We hypothesized that to the degree that a VE seems real, it would evoke physiological responses similar to those evoked by the corresponding real environment, and that greater presence would evoke a greater response. To examine this, we conducted three experiments, the results of which support the use of physiological reaction as a reliable, valid, sensitive, and objective presence measure. 
  <br />
  <br />
  <br />
  <div class="oblique">Meehan, Michael, Brent Insko, Mary Whitton, and Frederick P Brooks. 2002. <br /><span xr-layer @click="linkClick" class="xrlink alink" id="Pit_link2"><a href="https://dl.acm.org/doi/10.1145/566654.566630" target="_blank">“Physiological Measures of Presence in Stressful Virtual Environments.”</a></span><br/> ACM Transactions on Graphics 21 (3): 645–52.</div>
  <br />
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
