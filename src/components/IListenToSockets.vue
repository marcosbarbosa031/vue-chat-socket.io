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

export default {
  data() {
    return {
      isConnected: false,
      socketMessage: [],
      inputText: '',
      userId: '',
    }
  },

  sockets: {
    connect() {
      // Fired when the socket connects.
      console.log('Conectou')
      this.isConnected = true;
    },

    disconnect() {
      this.isConnected = false;
    },

    // Fired when the server sends something on the "messageChannel" channel.

    chatMessage(data) {
      this.socketMessage.push(data)
    }
  },

  methods: {
    sendMessage() {
      // Send the "pingServer" event to the server.
      let data = {
        userId: this.userId,
        message: this.inputText
      }
      this.$socket.emit('chatMessage', data)
      this.inputText = ''
    }
  },

  beforeMount () {
    this.userId = uuid.v4()
    console.log('userId :', this.userId)
  }
}
</script>