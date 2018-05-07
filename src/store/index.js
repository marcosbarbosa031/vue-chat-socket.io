import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isConnected: false,
    socketMessage: ''
  },

  mutations: {
    SOCKET_CONNECT(state) {
      state.isConnected = true;
    },

    SOCKET_DISCONNECT(state) {
      state.isConnected = false;
    },

    SOCKET_USER_MESSAGE(state, message) {
      state.socketMessage = message
    }
  },
  actions: {
    otherAction: (context, type) => {
      return true;
    },
    socket_userMessage: (context, message) => {
      context.dispatch('newMessage', message);
      context.commit('SOCKET_USER_MESSAGE', message);
      if (message.is_important) {
        context.dispatch('alertImportantMessage', message);
      }
    }
  }
})