<template>
<div>
  <!-- QuestionIndex -->
  <div class="flex items-center justify-between">
    <h3 class="text-lg font-bold">
      {{ index + 1 }}. {{ model.question }}
    </h3>

    <div class="flex items-center">
      <!-- AddNewQuestion -->
      <div type="button" @click="addQuestion()"
        class="flex items-center px-3 py-1 text-xs mr-2 text-white rounded-sm bg-gray-600 hover:bg-gray-700 cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 inline-block">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Add Question
      </div>
      <!-- /AddNewQuestion -->

      <!-- DeleteQuestion -->
      <button v-if="question.id" type="button" @click="deleteQuestion(question)"
        class="px-3 py-1 flex items-center rounded border border-transparent text-xs text-red-500
        hover:border-red-600">

        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
        Delete
      </button>
      <!-- /DeleteQuestion -->
    </div>
  </div>
  <!-- /QuestionIndex -->

  <div class="grid gap-3 grid-cols-12">
    <!-- Question -->
    <div class="mt-3 col-span-9">
      <label :for="'question_text_' + model.data"
        class="flex text-sm font-medium text-gray-700">Question Text</label
      >

      <input type="text" name="'question_text_' + model.data" v-model="model.question" @change="dataChange" :id="'question_text_' + model.data"
        class="mt-1 focus:ring-infigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
      />
    </div>
    <!-- /Question -->

    <!-- QuestionType -->
    <div class="mt-3 col-span-3">
      <label for="question_type" class="flex text-sm font-medium text-gray-700">Select Question Type</label>
      <select id="question_type" name="question_type" v-model="model.type" @change="typeChange"
        class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none
        focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <option v-for="t in questionTypes" :key="t" :value="t">
          {{ upperCaseFirst(t) }}
        </option>
      </select>
    </div>
    <!-- /QuestionType -->
  </div>

  <!-- QuestionDescription -->
  <div class="mt-3 col-span-9">
    <label for="" class="flex text-sm font-medium text-gray-700">Description</label>
    <textarea :name="'question_description_' + model.id" :id="'question_description_' + model.id"
      v-model="model.description" @change="dataChange"
      class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"></textarea>
  </div>
  <!-- /QuestionDescription -->

  <!-- OptionsData -->
  <div>
    <div v-if="shouldHaveOptions()" class="mt-2">
      <h4 class="text-sm fomt-semibold mb-1 flex justify-between items-center">
        Options

        <!-- Add Options -->
        <button type="button" @click="addOption()"
        class="flex items-center text-sm px-2 py-1 rounded-sm text-white bg-gray-600 hover:bg-gray-700"
        >
          <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clip-rule="evenodd"
            />
          </svg>
          Add Option
        </button>
      </h4>
      <div
        v-if="!model.options.length"
        class="text-xs text-gray-600 text-center py-3"
      >
        You don't have any options defined
      </div>
      <!-- Option list -->
      <div
        v-for="(option, index) in model.options"
        :key="option.uuid"
        class="flex items-center mb-1"
      >
        <span class="w-6 text-sm"> {{ index + 1 }}. </span>
        <input
          type="text"
          tabindex="1"
          v-model="option.text"
          @change="dataChange"
          class="
            w-full
            rounded-sm
            py-1
            px-2
            text-xs
            border border-gray-300
            focus:border-indigo-500
          "
        />
        <!-- Delete Option -->
        <button
          type="button"
          @click="removeOption(option)"
          class="
            h-6
            w-6
            rounded-full
            flex
            items-center
            justify-center
            border border-transparent
            transition-colors
            hover:border-red-100
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-3 w-3 text-red-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        <!--/ Delete Option -->
      </div>
      <!--/ Option list -->
    </div>
  </div>
  <!--/ QuestionData -->
  <hr class="my-4" />
</div>
</template>

<script setup>
import { ref,computed } from "@vue/reactivity";
import { v4 as uuidv4} from "uuid";
import store from "../../store";

const props = defineProps({
  question: Object,
  index: Number
});

const emits = defineEmits(["change", "addQuestion", "deleteQuestion"]);

// Re-create the whole question date to avoid unintentional reference change
const model = ref(JSON.parse(JSON.stringify(props.question)));

const questionTypes = computed(() => store.state.questionTypes);

//first char to uppercase
function upperCaseFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

//check if question should have options
function shouldHaveOptions() {
  return ["select", "radio", "checkbox"].includes(model.value.type);
}

function setOptions(options) {
  model.value.options = options;
}

function getOptions(){
  return model.value.options;
}

function addOption() {
  var opts = getOptions();
  opts.push({uuid: uuidv4, text: ""});
  setOptions(opts);
  dataChange();
}

function removeOption(op) {
  setOptions(getOptions().filter((opt) => opt !== op));
  dataChange();
}

function typeChange() {
  if(shouldHaveOptions()){
    setOptions(getOptions() || []);
  }
  dataChange();
}

function dataChange() {
  const data = JSON.parse(JSON.stringify(model.value));
  if(shouldHaveOptions()){
    delete data.data.options;
  }

  emit("change", data);
}

function addQuestion() {
  emits("addQuestion", props.index + 1);
}

function deleteQuestion() {
  emits("deleteQuestion", props.question);
}

</script>

<style>

</style>
