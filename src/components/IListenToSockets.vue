<template>
  <div>
    <p v-if="isConnected">We're connected to the server!</p>
    <p v-for="message in socketMessage" :key="message.id">{{message.userId}}: {{message.message}}</p>
    <form action="" @submit.prevent="sendMessage">
      <input type="text" name="message" v-model="inputText">
      <button >Send</button>
    </form>
  </div>
</template>

<script>
import { uuid } from 'vue-uuid'
import socketio from 'socket.io-client'

export default {
  data() {
    return {
      isConnected: false,
      socketMessage: [],
      inputText: '',
      userId: '',
      socket: null
    }
  },

  methods: {
    connectSocker () {
      let socket = socketio('http://localhost:5000')
      this.socket = socket

      let data = {
        session: 'dad7f362-2c09-4398-83a7-9529e44f407d',
        name: 'Eu carai'
      }

      this.socket.emit('join', data)

      this.isConnected = true;

      this.socket.on('chatMessage', msg => {
        console.log('msg: ', msg)
        console.log('socketMessage: ', this.socketMessage)
        this.socketMessage.push(msg)
      })

    },
    sendMessage() {
      // Send the "pingServer" event to the server.
      let data = {
        userId: this.userId,
        message: this.inputText
      }
      this.socket.emit('chatMessage', data)
      this.inputText = ''
    }
  },

  beforeMount () {
    this.userId = uuid.v4()
    console.log('userId :', this.userId)
  },

  mounted () {
    this.connectSocker()
  }
}
</script>