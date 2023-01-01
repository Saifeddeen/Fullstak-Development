<template>
  <page-component>
    <template v-slot:header>
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold text-gray-900">
          {{ model.id ? model.title : "Create a Survey" }}
        </h1>
      </div>
      <form @submit.prevent="saveSurvey">
        <div class="shadow sm:rounded-md sm:overflow-hidden">
          <div class="px-4 py-5 bg-white space-y-6 sm:p-6">
            <!-- Image -->
            <div>
              <label class="flex text-md font-medium text-gray-700">Image</label>
              <div class="mt-1 flex items-center">
                <img v-if="model.image" :src="model.image" :alt="model.title" class="w-64 h-48 object-cover" />

                <span v-else class="flex items-center justify-center w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                </span>
                <button type="button" class="relative overflow-hidden ml-5 bg-white py-2 px-3 border border-gray-300
                  rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none
                  focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <input type="file" class="absolute top-0 left-0 bottom-0 right-0 opacity-0 cursor-pointer" />
                    Change
                </button>
              </div>
            </div>
            <!-- Title -->
            <div>
              <label for="title" class="flex text-md font-medium text-gray-700">Title</label>
              <input type="text" name="title" id="title" v-model="model.title" autocomplete="survey_title"
               class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm
               border-gray-300 rounded-md" />
            </div>

            <!-- Description -->
            <div>
              <label for="description" class="flex text-md font-medium text-gray-700">Description</label>
              <textarea name="description" id="description" v-model="model.description" autocomplete="survey_description"
               class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm
               border-gray-300 rounded-md"></textarea>
            </div>

            <!-- Expire Date -->
            <div>
              <label for="expire_date" class="flex text-md font-medium text-gray-700">Expire Date</label>
              <input type="date" name="expire_date" id="expire_date" v-model="model.expire_date"
               class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm
               border-gray-300 rounded-md" />
            </div>

            <!-- Status -->
            <div class="flex items-start">
              <div class="flex items-center">
                <input type="checkbox" name="status" id="status" v-model="model.status"
                 class="h-4 w-4 focus:ring-indigo-500 text-indigo-600 border-gray-300 rounded" />
              </div>
              <div class="ml-3 text-md">
                <label for="status" class="font-medium text-gray-700">Active</label>
              </div>
            </div>
            <!-- /Status -->
            <!-- /SurveyFields -->

            <!-- Questions -->
            <div class="px-4 py-5 bg-white space-y-6 sm:p-6">
              <h3 class="text-2xl font-semiibold flex items-cente justify-between">
                Questions

                <button type="button" @click="addQuestion()"
                  class="flex items-center text-sm px-4 py-1 rounded-sm text-white bg-gray-600 hover:bg-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 inline-block">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Add Questions
                </button>
              </h3>
            </div>
            <div v-if="!model.questions.length" class="text-center text-gray-600">
              You don't have any questions created
            </div>
            <div v-else v-for="(q, i) in model.questions" :key="q.id">
              <QuestionEditor :question="q" :index="i"
                @change="questionChange" @addQuestion="addQuestion" @deleteQuestion="deleteQuestion"
              />
            </div>
            <!-- /Questions -->
          </div>
          <div class="px-4 py-3 bg-gray-50 text-rigth sm:px-6">
            <button type="submit" class="inline-flex justify-center bg-indigo-600 py-2 px-4 border border-transparent
                  rounded-md shadow-sm text-sm leading-4 font-medium text-white hover:bg-indigo-700 focus:outline-none
                  focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit
            </button>
          </div>
        </div>

      </form>
    </template>
  </page-component>
</template>

<script setup>
import PageComponent from '../components/PageComponent.vue';
import QuestionEditor from '../components/editor/QuestionEditor.vue';

import {useRoute} from 'vue-router';
import {ref} from 'vue';
import {v4 as uuidv4} from 'uuid';
import store from '../store';
import router from '../router';

const route = useRoute();

let model = ref({
  title: "",
  status: false,
  description: null,
  image: null,
  expire_date: null,
  questions: []
});

//find the requested survey from its id
if(route.params.id){
  model.value = store.state.surveys.find(
    (s) => s.id === parseInt(route.params.id)
  );
}

function addQuestion(i) {
  const newQuestion = {
    id: uuidv4,
    type: "text",
    question: "",
    description: null,
    data: {}
  }
  model.value.questions.splice(i, 0, newQuestion);
}

function deleteQuestion(q) {
  model.value.questions = model.value.questions.filter((ques) => ques !== q);
}

function questionChange(q) {
  model.value.questions = model.value.questions.map(
    (ques) => {
      if(ques.id === q.id){
        return JSON.parse(JSON.stringify(q));
      }
      return ques;
    }
  )
}

function saveSurvey() {
  store.dispatch('saveSurvey', model.value).then(({data}) => {
    router.push({
      name: "SurveyView",
      params: {id: data.data.id}
    });
  });
}

</script>

<style>

</style>
