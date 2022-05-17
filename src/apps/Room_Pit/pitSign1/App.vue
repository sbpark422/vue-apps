<template>
  <div> 
  <div id="room">
<div class="spacer-side">
  <div class="squareoff">
  <br>
  <img class="centerImg" height="300" src="../../../assets/images/Pit/Original_pit.jpg">
  <br />
A view of the original Pit model shows a side view of the virtual environment. Subjects start in the Training Room and later enter the Pit Room.   
<br><br>
<div class="oblique">Meehan, Michael, Brent Insko, Mary Whitton, and Frederick P Brooks. 2002. (Figure 1 in “Physiological Measures of Presence in Stressful Virtual Environments.” ACM Transactions on Graphics 21 (3): 645–52.)</div>
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
