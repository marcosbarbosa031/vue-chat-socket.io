import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      userId: null,
      username: ''
    }
  },

  mutations: {
    SET_USERNAME(state, username) {
      state.user.username = username;
    },

    SET_USER_ID(state, userId) {
      state.user.userId = userId;
    }
  },

  getters: {
    getUserId: state => {
      return state.user.userId;
    },

    getUsername: state => {
      return state.user.username;
    }
  },

  actions: {
    otherAction: (context, type) => {
      return true;
    },

    set_username: (context, username) => {
      context.commit('SET_USERNAME', username);
    },

    set_user_id: (context, userId) => {
      context.commit('SET_USER_ID', userId);
    }

  }
})