<template>
  <div> 
  <div id="room" class="darkwall">
  <div class="spacer-side">
  <Title msg="Ultimate Empathy Machine" />
  <br><br>
  <div class="squareoff">360<span>&#176;</span> film Clouds Over Sidra created by Chris Milk and Gabo Arora shows the life of Syrian refugees in Za'atari camp in Jordan. The camera follows 12-year old Sidra in her everyday life, allowing the users to be present with Sidra. </div>
  <br />
  <blockquote class="squareoff">"When you’re inside of the headset . . . you see full 360 degrees, in all directions. And when you’re sitting there in her room, watching her, you're not watching it through a television screen, you’re not watching it through a window, <span style="fontWeight:700">you’re sitting there with her.</span> When you look down, you're sitting on the same ground that she’s sitting on. And because of that, you feel her humanity in a deeper way. You empathize with her in a deeper way. (Milk 2015)"</blockquote>
  <br /> <br />
  <div style="float: right;">
    <span xr-layer @click="linkClick" class="xrlink alink" id="Milk_link"><a href="https://www.ted.com/talks/chris_milk_how_virtual_reality_can_create_the_ultimate_empathy_machine?language=yi" target="_blank">Click here to learn more about the video</a></span>  
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
