<template>
  <form class="username-card" action="" @submit.prevent="tochat" autocomplete="off">
    <input type="text" v-model="username" placeholder="Enter a username" />
    <button v-bind:disabled="username === ''">
      Enter Chat
    </button>
  </form>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      username: ""
    };
  },

  methods: {
    tochat() {
      this.$store.dispatch('set_username', this.username);
      this.$store.dispatch('set_is_home', false);
    }
  },
};
</script>

<style>
  .username-card {
    padding: 50px;
    margin: auto;
    background: white;
  }

  input {
    border-radius: 20px;
    background: #eeeeee;
    outline: none;
    padding: 0 14px;
    height: 30px;
    border: none;
  }

  button {
    background: #5f9bf5;
    border: none;
    color: white;
    padding: 6px 15px;
    border-radius: 25px;
    outline: none;
  }

  button:hover {
    cursor: pointer;
    background: #5f9bf5ad;
  }
</style>
