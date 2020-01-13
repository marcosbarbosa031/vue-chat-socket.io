<template>
  <div class="chat">

    <div class="chat-container">
      <!-- Users -->
      <div class="chatbox-card mr-10px w-30">
        <div class="user-row p-20" v-for="user in users" :key="user.userId">
          <div class="user-icon"></div>
          <div class="username">{{user.username | capitalize}}</div>
        </div>
      </div>

      <div class="chatbox-card ml-10px w-70">
        <!-- Messages -->
        <div id="chat" class="message-container">
          <div class="msg-holder" v-for="message in userMessages" :key="message.id">
            <!-- Server Message -->
            <div class="server-msg" v-if="message.server">
              {{ message.message | capitalize }}
            </div>

            <!-- User Message -->
            <div v-if="!message.server && message.userId !== userId">
              <div class="user-left-name">
                {{message.username | capitalize}}
              </div>
              <div class="user-msg msg-left">
                <p>{{ message.message }}</p>
              </div>
            </div>

            <div class="user-msg msg-right" v-if="!message.server && message.userId === userId">
              <p>{{ message.message }}</p>
            </div>
          </div>
        </div>

        <!-- input -->
        <form class="message-input" action="" @submit.prevent="sendMessage" autocomplete="off">
          <input class="mr-10 w-85" type="text" name="message" v-model="inputText" />
          <button class="w-15">Send</button>
        </form>

      </div>

    </div>

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
      users: [],
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
        this.removeUser(user);
        console.log('users: ', this.users);
        this.socket.emit('leave', user);
      }

      this.socket.emit("join", user);

      this.socket.on("chatMessage", message => {
        console.log("message: ", message);
        this.userMessages.push(message);
        this.scrollDown();
      });

      this.socket.on('userDisconnected', message => {
        console.log("message disconnect: ", message);
        this.removeUser(user);
        this.userMessages.push(message);
        console.log('users: ', this.users);
      });

      this.socket.on('updateUsers', users => {
        console.log('users: ', users);
        this.users = users;
      })
    },

    sendMessage() {
      let data = {
        userId: this.userId,
        username: this.username,
        message: this.inputText,
        server: false
      };
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
    },

    removeUser(user) {
      this.users.splice(this.users.indexOf(u => u.userId === user.userId), 1);
    },

    async scrollDown() {
      let chat = document.getElementById("chat");
      setTimeout(() => { chat.scrollTop = chat.scrollHeight; }, 100);
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

<style scoped>
  .ml-10px {
    margin-left: 10px;
  }

  .mr-10px {
    margin-right: 10px;
  }

  .w-70 {
    width: 70%;
  }

  .w-85 {
    width: 85%;
  }

  .w-15 {
    width: 15%;
  }

  .w-30 {
    width: 30%;
  }

  .p-20 {
    padding: 20px;
  }

  .chat {
    background: cadetblue;
    height: 100vh;
    display: flex;
  }

  .chat-container {
    width: 90%;
    height: 80vh;
    margin: auto;
    background: white;
    border-radius: 20px;
    padding: 20px;
    display: flex;
  }

  .chatbox-card {
    border: 1px solid black;
    border-radius: 10px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }

  .message-container {
    height: 88%;
    overflow: auto;
    padding: 20px;
  }

  .message-input{
    display: flex;
    height: 5%;
  }

  .message-input input {
    border-radius: 20px;
    border: 1px solid #b7b7b7;
    outline: none;
    padding: 0 14px;
  }

  .user-row {
    border-bottom: 1px solid #cfcfcf;
  }

  .msg-holder {
    display: flow-root;
    padding: 5px 0;
  }

  .server-msg {
    text-align: center;
    color: #b4b4b4;
    font-style: italic;
  }

  .msg-right {
    float: right;
    background: #1f9cf4;
    color: white;
  }

  .msg-left {
    float: left;
    background: #e6e6e6;
  }

  .user-msg {
    padding: 0 20px;
    border-radius: 30px;
  }

  .user-left-name {
    position: relative;
    top: 13px;
    left: 6px;
    background: #1f9cf4;
    color: white;
    padding: 0 10px;
    border-radius: 10px;
    display: table;
  }
</style>
