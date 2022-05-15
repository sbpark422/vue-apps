<template>
  <div> 
  <div id="room" class="darkwall">
  <div class="spacer">
  <br />
  <div  style="float:left; margin-right:20px">
   <span xr-layer @click="linkClick">
      <a class="img_Hover2" href="https://mitpress.mit.edu/books/reality-media" target="_blank">
        <img src="../../../assets/images/Onboarding/realityMediaBook.jpg" height="80">
      </a>
    </span>
  </div>
   <div style="float:left; margin-right:20px">
   <span class="img_Hover2">
      <a xr-layer @click="linkClick" href="https://mitpress.mit.edu/books/reality-media" target="_blank">
        <img src="../../../assets/images/Onboarding/realityMediaBook.jpg" height="80">
      </a>
    </span>
  </div>
     <div style="float:left; margin-right:20px">
      <a xr-layer @click="linkClick" href="https://mitpress.mit.edu/books/reality-media" target="_blank">
        <img class="img_Hover2" src="../../../assets/images/Onboarding/realityMediaBook.jpg" height="80">
      </a>
  </div>
   <div style="float:left; margin-right:20px">
   <span class="img_Hover2">
      <a href="https://mitpress.mit.edu/books/reality-media" target="_blank">
        <img xr-layer @click="linkClick" src="../../../assets/images/Onboarding/realityMediaBook.jpg" height="80">
      </a>
    </span>
  </div>
   <div style="float:left; margin-right:20px">
      <a class="img_Hover2" href="https://mitpress.mit.edu/books/reality-media" target="_blank">
        <img xr-layer @click="linkClick" src="../../../assets/images/Onboarding/realityMediaBook.jpg" height="80">
      </a>
  </div> <div  style="float:left; margin-right:20px">
   <div class="img_Hover2">
      <a href="https://mitpress.mit.edu/books/reality-media" target="_blank">
        <img xr-layer @click="linkClick" src="../../../assets/images/Onboarding/realityMediaBook.jpg" height="80">
      </a>
    </div>
  </div>

  </div>
  </div>
  </div> 
</template>

<script setup>
import Title from '../../../components/CenterTitle.vue'

import "../../../assets/top.css"
import "../../../assets/room.css"
</script>

<style scoped>
.img_Hover2:hover{
outline: #333 solid 4px;
}

</style>
