<template>
  <div> 
  <div id="room" class="darkwall">
  <div class="spacer">
  <br />
  
  <div  style="float:left; margin-right:20px">
   <span xr-layer @click="linkClick">
    <span style="position:relative;">
      <a class="img_Hover2" href="https://mitpress.mit.edu/books/reality-media" target="_blank">
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
<br /><br />
        <img src="../../../assets/images/Onboarding/realityMediaBook.jpg" width="50" height="80">
      </a>
    </span>
    </span>
  </div>  
 <div  style="float:left; margin-right:20px">
   <span xr-layer @click="linkClick">
    <span style="position:relative; bottom: 40px;">
      <a class="img_Hover2" href="https://mitpress.mit.edu/books/reality-media" target="_blank">
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
<br /><br />
        <img src="../../../assets/images/Onboarding/realityMediaBook.jpg" height="80">
      </a>
    </span>
    </span>
  </div>  
   <div  style="float:left; margin-right:20px">
   <span xr-layer @click="linkClick">
    <span style="position:relative;">
      <a class="img_Hover2" href="https://mitpress.mit.edu/books/reality-media" target="_blank">
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
<br /><br />
        <img src="../../../assets/images/Onboarding/realityMediaBook.jpg"  height="80">
      </a>
    </span>
    </span>
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
.img_Hover2:hover{
outline: #333 solid 4px;
}

</style>
