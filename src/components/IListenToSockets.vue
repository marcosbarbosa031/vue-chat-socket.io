<template>
  <div>
    <div v-for="message in userMessages" :key="message.id">
      <div v-if="message.server">
        <p>{{ message.message | capitalize }}</p>
      </div>
      <div v-if="!message.server">
        <p>{{ message.username | capitalize }}: {{ message.message }}</p>
      </div>
    </div>
    <form action="" @submit.prevent="sendMessage">
      <input type="text" name="message" v-model="inputText" />
      <button>Send</button>
    </form>
  </div>
</template>

<script>
import socketio from "socket.io-client";
import { uuid } from "vue-uuid";

export default {
  data() {
    return {
      isConnected: false,
      userMessages: [],
      inputText: "",
      userId: "",
      username: "",
      socket: null
    };
  },

  methods: {
    connectSocker() {
      let socket = socketio("http://localhost:4113");
      this.socket = socket;

      let user = {
        userId: this.userId,
        username: this.username
      };
      this.isConnected = true;

      window.onbeforeunload = () => {
        this.socket.emit('leave', user);
      }

      this.socket.emit("join", user);

      this.socket.on("chatMessage", message => {
        console.log("message: ", message);
        this.userMessages.push(message);
      });

      this.socket.on('userDisconnected', message => {
        console.log("message: ", message);
        this.userMessages.push(message);
      })
    },

    sendMessage() {
      let data = {
        username: this.username,
        message: this.inputText,
        server: false
      };
      console.log("data: ", data);
      this.socket.emit("chatMessage", data);
      this.inputText = "";
    },

    checkLocalStorage() {
      if (this.$store.getters.getUsername) {
        this.username = this.$store.getters.getUsername;
        this.userId = this.$store.getters.getUserId;
      } else {
        this.$router.push({ path: "/" });
      }
    },

    generateUuid() {
      this.userId = uuid.v4();
      this.$store.dispatch("set_user_id", this.userId);
      console.log("userId :", this.userId);
    }
  },

  beforeMount() {
    this.generateUuid();
    this.checkLocalStorage();
  },

  mounted() {
    this.connectSocker();
  },
};
</script>
