<template>
  <div> 
  <div id="room" class="darkwall">
  <div class="spacer">
  <Title msg="Reality Media" />
  <br />
  <div xr-layer style="float:left; margin-right:20px">
   <span  @click="linkClick" class="alink_img">
      <a href="https://mitpress.mit.edu/books/reality-media" target="_blank">
        <img class="img_Hover" src="../../../assets/images/Onboarding/realityMediaBook.jpg" height="383">
      </a>
    </span>
  </div>

   <div class="squareoff"><div style="margin-left:30px">Published by <span xr-layer @click="linkClick" class="alink"><a href="https://mitpress.mit.edu/books/reality-media" target="_blank">MIT Press.</a></span></div>
  <br />

  <div class="oblique">By Jay David Bolter, Maria Engberg and Blair MacIntyre</div> 
  <br>
  <br>
  How augmented reality and virtual reality are taking their places in contemporary media culture alongside film and television.
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
.middle {
  transition: .5s ease;
  opacity: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  text-align: center;
}
.textx {
  background-color: #04AA6D;
  color: white;
  font-size: 16px;
  padding: 16px 32px;
}
</style>
