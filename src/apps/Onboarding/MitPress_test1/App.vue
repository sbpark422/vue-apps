<template>
  <div> 
  <div id="room" class="darkwall">
  <div class="spacer">
  <br />
  <div  style="float:left; margin-right:20px">
   <span xr-layer @click="linkClick">
    <span style="position:relative; bottom: 60px;">
      <a class="img_Hover2" href="https://mitpress.mit.edu/books/reality-media" target="_blank">
        <img src="../../../assets/images/Onboarding/realityMediaBook.jpg" height="80">
      </a>
    </span>
    </span>
  </div>
  <div  style="float:left; margin-right:20px">
   <span xr-layer @click="linkClick">
    <span style="position:relative; bottom: 40px;">
      <a class="img_Hover2" href="https://mitpress.mit.edu/books/reality-media" target="_blank">
        <img src="../../../assets/images/Onboarding/realityMediaBook.jpg" height="80">
      </a>
    </span>
    </span>
  </div>  
  <div  style="float:left; margin-right:20px">
   <span xr-layer @click="linkClick">
    <span style="position:relative; bottom: 20px;">
      <a class="img_Hover2" href="https://mitpress.mit.edu/books/reality-media" target="_blank">
        <img src="../../../assets/images/Onboarding/realityMediaBook.jpg" height="80">
      </a>
    </span>
    </span>
  </div>  
   <div  style="float:left; margin-right:20px">
   <span xr-layer @click="linkClick">
    <span style="position:relative; bottom: 20px; height:160">
    
      <a class="img_Hover2" href="https://mitpress.mit.edu/books/reality-media" target="_blank">
        <img src="../../../assets/images/Onboarding/realityMediaBook.jpg" height="80">
      </a>
    </span>
    </span>
  </div>  
     <div  style="float:left; margin-right:20px">
   <span xr-layer @click="linkClick">
    <span style="position:relative; bottom: 20px; height:200">
    
      <a class="img_Hover2" href="https://mitpress.mit.edu/books/reality-media" target="_blank">
        <img src="../../../assets/images/Onboarding/realityMediaBook.jpg" height="80">
      </a>
    </span>
    </span>
  </div>  
  <div  style="float:left; margin-right:20px">
   <span xr-layer @click="linkClick">
    <span style="position:relative; bottom: 60px;">
      <a class="img_Hover2" href="https://mitpress.mit.edu/books/reality-media" target="_blank">
        <img src="../../../assets/images/Onboarding/realityMediaBook.jpg" height="80">
      </a>
    </span>
    </span>
  </div>

     <div style="float:left; margin-right:20px">
      <a xr-layer @click="linkClick" href="https://mitpress.mit.edu/books/reality-media" target="_blank">
        <img class="img_Hover2" src="../../../assets/images/Onboarding/realityMediaBook.jpg" height="80">
      </a>
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
