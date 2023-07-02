<template>
  <div>
    <div id="room" class="darkwall" :style="style">
      <div class="titleStyle">{{ title }}</div>
      <!-- <input v-model="content" type="text" placeholder="Ask something..." class="input" clear> -->
      <input v-model="content" type="text" placeholder="Ask something..." class="input" clear>
      <!-- <input v-model="content" type="text" placeholder="Ask something..." class="input" clear> -->
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

// const askAi = () => {
//   res.value = 'What is Reality Media?';
//   //content.value; // Display the user's input in the answer section
//   //content.value = ''; // Clear the input field
//   btnText.value = BTN_TEXT; // Reset the button text
// }


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

</script>
