<template>
  <div class="chat">

    <div class="chat-container">
      <div class="chat-header">
        <div class="tab-chat">
          <div class="tab-txt tab-selected">Global</div>
        </div>
        <div class="tab-chat">
          <div class="tab-txt">Private</div>
        </div>
      </div>

      <div class="chat-body">
        <!-- Users -->
        <div class="chatbox-card w-30">
          <div class="user-row p-20" v-bind:class="{ mainuser: isMainUser(user) }" v-for="user in users" :key="user.userId">
            <div class="user-icon"></div>
            <div class="username">{{user.username | capitalize}}</div>
          </div>
        </div>

        <div class="chatbox-card w-70">
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
                  {{ message.message }}
                </div>
              </div>

              <div class="user-msg msg-right" v-if="!message.server && message.userId === userId">
                {{ message.message }}
              </div>
            </div>
          </div>

          <!-- input -->
          <form class="message-input" action="" @submit.prevent="sendMessage" autocomplete="off">
            <input class="mr-10 w-85" type="text" name="message" v-model="inputText" placeholder="Digite uma mensagem..." />
            <button class="w-15 send-btn">
              <img type="submit"  src="../assets/svg/send.svg" alt="">
            </button>
          </form>

        </div>
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
      socket: null,
      isActive: true
    };
  },

  methods: {
    connectSocker() {
      let port = process.env.PORT || 3000;
      if (process.env.PORT) {
        this.socket = socketio("https://vue-chat-online.herokuapp.com/");
      } else {
        this.socket = socketio("http://localhost:3000");
      }

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

      this.socket.emit("joinMain", user);

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
      if (this.inputText !== '') {
        let data = {
          userId: this.userId,
          username: this.username,
          message: this.inputText,
          server: false
        };
        this.socket.emit("chatMessage", data);
        this.inputText = "";
      }
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
    },

    isMainUser(user) {
      return user.userId === this.userId;
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
    background: #F0F0F7;
    height: 100vh;
    display: flex;
  }

  .chat-container {
    width: 90%;
    height: 80vh;
    margin: auto;
    background: white;
  }

  .chat-header {
    height: 10%;
    width: 100%;
    display: flex;
  }

  .chat-body {
    display: flex;
    height: 90%;
  }

  .chatbox-card {
    border-top: 1px solid #e4e4e4;
    border-right: 1px solid #e4e4e4;
  }

  .message-container {
    height: 88%;
    padding: 10px 20px;
    overflow: auto;
  }

  .message-input{
    display: flex;
    height: calc(12% - 20px);
    border-top: 1px solid #e4e4e4;
  }

  .message-input input {
    border-radius: 20px;
    width: 75%;
    background: #dedede;
    outline: none;
    padding: 0 14px;
    height: 60%;
    margin: auto 0 auto auto;
    border: none;
  }

  .user-row {
    border-bottom: 1px solid #e4e4e4;
  }

  .mainuser {
    background: #f7f7fb;
    color: #353535;
  }

  .msg-holder {
    display: flow-root;
    padding: 5px 0;
  }

  .server-msg {
    font-size: 14px;
    text-align: center;
    color: #b4b4b4;
    font-style: italic;
  }

  .msg-right {
    float: right;
    border-bottom-right-radius: 4px !important;
    background: #1f9cf4;
    color: white;
  }

  .msg-left {
    float: left;
    border-bottom-left-radius: 4px !important;
    background: #e6e6e6;
  }

  .user-msg {
    padding: 10px 20px;
    border-radius: 30px;
    max-width: 80%;
    font-size: 14px;
  }

  .user-left-name {
    font-size: 12px;
    position: relative;
    top: 13px;
    left: 6px;
    background: #1f9cf4;
    color: white;
    padding: 0 10px;
    border-radius: 10px;
    display: table;
  }

  .tab-chat {
    display: flex;
    width: 200px;
    cursor: pointer;
  }

  .tab-selected {
    border-bottom: 2px solid #1f9cf4;
    color: #1f9cf4 !important;
  }

  .tab-txt {
    margin: auto;
    font-size: 18px;
    color: #b5b5b5;
    font-weight: 600;
  }

  .send-btn {
    height: 40px;
    margin: auto 0;
    border: none;
    background: none;
    outline: none;
  }

  .send-btn img:hover {
    cursor: pointer;
  }

  .send-btn img {
    width: 40px;
  }
</style>
