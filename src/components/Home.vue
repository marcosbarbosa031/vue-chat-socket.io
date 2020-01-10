<template>
  <div>
    <input type="text" v-model="username" placeholder="Enter a username" />
    <button @click.prevent="tochat" v-bind:disabled="username === ''">
      Enter Chat
    </button>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      userId: null,
      username: ""
    };
  },

  methods: {
    tochat() {
      this.$store.dispatch('set_username', this.username);
      this.$router.push({ path: "/chat" });
    }
  },
};
</script>

<style></style>
