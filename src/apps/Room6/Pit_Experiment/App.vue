<template>
  <div> 
   <div id="room" class="darkwall">
    <div class="spacer-side">
     <Title msg="Pit Experiement" />
     <br>
  	   <div class="squareoff">The Pit experiments were conducted by researchers at the <span xr-layer @click="linkClick" class="xrlink alink" id="Pit_Presence_link"><a href="http://wwwx.cs.unc.edu/Research/eve/walk_exp/" target="_blank">University of North Carolina</a></span> in the early 2000s, to establish empirical evidence of presence in virtual reality. They constructed a physical set, complete with platforms and walls, that matched the virtual scene. The subjects were asked to perform simple tasks that involved walking to the edge of a virtual pit. Researchers measured their physiological reactions to see if they experienced signs of fear, such as an accelerated heart beat. Pass through the portal to experience a replica of one version of their Pit Room yourself.
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
