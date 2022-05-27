<template>
  <div> 
  <div id="room" class="darkwall">
  <div class="spacer-side">
  <Title msg="Treehugger: Wawona" />
  <br><br>
	<div class="squareoff">Treehugger: Wawona VR experience transports the users to the red giant Sequoia trees from the Sequoia National Park. It provides a sense of intimacy with the tree - with its bark, with the cells that make up its being. The vividness of the work illustrates <em>presence</em>. 
  <br />
  <br />
  <div style="float: right;">
  <span xr-layer @click="linkClick" class="xrlink alink" id="Treehugger_link"><a href="https://www.youtube.com/watch?v=if0wfysmoMU&ab_channel=MarshmallowLaserFeast" target="_blank">Click here to learn more about the video</a></span>
  </div>
  </div>


  <!-- In this experience, users find themselves on the threshold of forgetting that we are having a VR experience. Being on that threshold is a sence of presence in a reality medium. -->
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
