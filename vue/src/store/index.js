import { createStore } from "vuex";
import axiosClient from "../axios";

const tempSurv = [
  {
    id: 100,
    title: 'Survey 100',
    slug: 'survey-100-slug',
    status: 'draft',
    image: 'https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500',
    description: 'survey 100 description',
    created_at: '2021/12/20 18:00:00',
    updated_at: '2021/12/20 18:00:00',
    expire_date: '2021/12/31 18:00:00',
    questions: [
      {
        id: 1,
        type: 'select',
        question: 'from which country?',
        description: null,
        options: [
          {
            uuid: '201c1ff5-23c9-42f9-bfb5-bbc850536440',
            text: 'Georgia'
          },
          {
            uuid: '201c1ff5-23c9-42f9-bfb5-bbc850536440',
            text: 'Georgia'
          },
          {
            uuid: '201c1ff5-23c9-42f9-bfb5-bbc850536440',
            text: 'Georgia'
          },
        ]
      }
    ]
  },

  {
    id: 101,
    title: 'Survey 101',
    slug: 'survey-101-slug',
    status: 'draft',
    image: 'https://smarttips.in/wp-content/uploads/2018/03/Laravel-logo.jpg',
    description: 'survey 100 description',
    created_at: '2021/12/20 18:00:00',
    updated_at: '2021/12/20 18:00:00',
    expire_date: '2021/12/31 18:00:00',
    questions: [
      {
        id: '1',
        type: 'select',
        question: 'from which country?',
        description: null,
        options: [
          {
            uuid: '201c1ff5-23c9-42f9-bfb5-bbc850536440',
            text: 'Georgia'
          },
          {
            uuid: '201c1ff5-23c9-42f9-bfb5-bbc850536440',
            text: 'Georgia'
          },
          {
            uuid: '201c1ff5-23c9-42f9-bfb5-bbc850536440',
            text: 'Georgia'
          },
        ]
      }
    ]
  }
];

const store = createStore({
  state: {
    user: {
      data: {},
      token: sessionStorage.getItem('TOKEN')
    },

    surveys: [...tempSurv],
    questionTypes: ["text", "select", "radio", "checkbox", "textarea"],
  },

  getters: {},

  actions: {

    register({commit}, user) {
      console.log('register');
      return axiosClient.post('/register', user)
        .then(({data}) => {
          commit('setUser', data);
          return data;
        });
    },

    login({commit}, user) {
      return axiosClient.post('/login', user)
        .then(({data}) => {
          commit('setUser', data);
          return data;
        });
    },

    logout({commit}){
      return axiosClient.post('/logout')
        .then(response => {
          commit('logout');
          return response;
        });
    },

    saveSurvey({commit}, survey){
      let response;

      if(survey.id){
        response = axiosClient
        .put(`/survey/${survey.id}`, survey)
        .then((res) => {
          commit("updateSurvey", res.data);
          return res;
        });
      }else{
        response = axiosClient
        .put(`/survey`, survey)
        .then((res) => {
          commit("saveSurvey", res.data);
          return res;
        });
      }

      return response;
    }
  },
  mutations: {

    logout(state) {
      state.user.data = {};
      state.user.token = null;
      sessionStorage.removeItem('TOKEN');
    },

    setUser(state, userData) {
      console.log("setUser");
      state.user.token = userData.token;
      state.user.data = userData.user;
      sessionStorage.setItem('TOKEN', userData.token);
    },

    saveSurvey: (state, survey) => {
      state.surveys = [state.surveys, survey.data];
    },

    updateSurvey: (state, survey) => {
      state.surveys = state.surveys.map((s) => {
        if(s.id == survey.data.id){
          return survey.data;
        }
        return s;
      });
    }
  },
  modules: {},
})

export default store;
