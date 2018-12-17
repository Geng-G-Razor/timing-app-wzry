const state = {
  isTitle: true
}

const mutations = {
  TOGGLE_TITLE (state) {
    state.isTitle = !state.isTitle
  }
}

const actions = {
  toggleTitle ({ commit }) {
    // do something async
    commit('TOGGLE_TITLE')
  }
}

export default {
  state,
  mutations,
  actions
}
