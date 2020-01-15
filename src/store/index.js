import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      userId: null,
      username: ''
    },
    isHome: true
  },

  getters: {
    getUserId: state => state.user.userId,

    getUsername: state => state.user.username,

    getIsHome: state => state.isHome
  },
  
  mutations: {
    SET_USERNAME(state, username) {
      state.user.username = username;
    },

    SET_USER_ID(state, userId) {
      state.user.userId = userId;
    },

    SET_IS_HOME(state, home) {
      state.isHome = home;
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
    },

    set_is_home: (context, home) => {
      context.commit('SET_IS_HOME', home);
    }

  }
})