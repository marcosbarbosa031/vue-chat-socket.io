<template>
<div>
  <button @click="tochat"></button>
</div>
</template>

<script>
export default {
  data () {
      return {

      }
  },
  methods: {
      tochat () {
          this.$router.push({path: '/chat'})
      }
  }
}
</script>

<style>

</style>
