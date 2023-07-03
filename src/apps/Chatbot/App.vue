<template>
  <div>
    <div id="room" class="darkwall" :style="style">
      <div class="titleStyle">{{ title }}</div>
      <!-- <input v-model="content" type="text" placeholder="Ask something..." class="input" clear> -->
      <!-- <input v-model="content" type="text" placeholder="Ask something..." class="input" readonly> -->
      <div class="input-area"> 
        <input v-model="content" type="text" placeholder="Ask something..." class="input">
        <button class="input-button">{{ content }}</button>
      </div>

      <div class="button-block">
        <button type="button" @click="askAi" class="btn">
          <strong>{{ btnText }}</strong>
          <div id="container-stars">
            <div id="stars"></div>
          </div>
          <div id="glow">
            <div class="circle"></div>
            <div class="circle"></div>
          </div>
        </button>
        <!-- <button xr-layer @click="shared.increment">count is: {{ shared.state.count }}</button> -->
      </div>


      
      <!-- <input v-model="content" type="text" placeholder="Ask something..." class="input" clear> -->

            <!-- Add the keyboard interface here -->
      <div class="keyboard">
        <button v-for="char in alphabet" :key="char" @click="addCharacter(char)">{{ char }}</button>
        <button @click="addCharacter(' ')">Space</button>
        <button @click="deleteCharacter()">Delete</button>
        <button @click="clearContent()">Clear</button>
      </div>

      <div class="card">
        <pre class="answer">{{ res }}</pre>
      </div>
        <!-- <div>
        <p>{{ `Test: ${shared.state.aiReply}` }}</p>
      </div> -->
    </div>
  </div>
</template>

<style scoped>
.input-area {
  display: flex;
  flex-direction: column;
  width: 100%; /* Makes the container take up full width */
}

.input-area .input,
.input-area .input-button {
  width: 100%; /* Makes children take up full width */
}

.keyboard {
  display: flex;
  flex-wrap: wrap;
  max-width: 300px;
  margin: 0 auto; /* Add this line */
  margin-top: 20px;
  margin-bottom: 20px;
}

.keyboard button {
  flex: 1 0 30px;
  margin: 1px;
  height: 30px;
}

.card {
  height: 600px;
  max-height: 200px; /* Adjust the maximum height as needed */
  overflow: auto;
  border: 1px solid #ccc;
  padding: 10px;
  box-sizing: border-box;
}

.answer {
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
  font-size: 0.5em; /* Adjust the font size as needed */
}

.input-button {
  display: none; /* This will hide the button */
  padding: 5px;
  width: 100%;
  font-size: 1em;
  color: black;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  cursor: text; /* changes the cursor to be similar to input fields */
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis; /* handle long texts */
  white-space: nowrap;
}
</style>

<script setup>
import { ref, inject } from 'vue'
import Title from '../../components/CenterTitle.vue'
// import axios from 'axios'
// import * as request from 'superagent';


import '../../assets/top.css'
import '../../assets/room.css'


let params = inject('params')
var title = params && params.text ? params.text : 'Soobin_v1 Testing...'
var color = params && params.color ? 'color: ' + params.color + ';' : 'color: green;'
var size = params && params.size ? 'font-size: ' + params.size + 'em;' : 'font-size: 2em;'
var style = color + size + 'white-space: nowrap;'

const shared = inject('shared')
const content = ref('What is Reality Media?')
const BTN_TEXT = 'Submit 🚀'
const res = ref('✅ The answer will be displayed here.')
const btnText = ref(BTN_TEXT)

console.log(import.meta.env)

const askAi = () => {
  btnText.value = 'Thinking...🤔'
  fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_OPEN_API_KEY}`,
      'OpenAI-Organization': import.meta.env.VITE_ORG_ID,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: content.value }],
      temperature: 0.7
    })
  })
    .then(response => response.json())
    .then(data => {
      console.log(data)
      let reply = data.choices[0].message.content
      shared.setAiReply(reply)
      res.value = reply
      console.log(`AI Response: ${shared.state.aiReply}`)  // This will output the answer to the console
    })
    .catch(function(error) {
      console.log(error)
    })
    .finally(() => {
      btnText.value = BTN_TEXT
    })
}


// Add data for the keyboard interface
let alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

// Add methods for the keyboard interface
const addCharacter = (char) => {
  content.value += char;
  shared.setContent(content.value);
}
const deleteCharacter = () => {
  content.value = content.value.slice(0, -1);
  shared.setContent(content.value);
}
const clearContent = () => {
  content.value = '';
  shared.setContent(content.value);
}

</script>
