<template>
  <div class="content">
    <div class="box">
      <h3>New Statement of Milestone {{milestone}}</h3>
      <o-field label="Title">
        <o-input v-model="title" type="text"></o-input>
      </o-field>
      <label>Outputs:</label>
      <QuillEditor
        class="mb-4"
        theme="snow" v-model:content="outputs" content-type="html" />
      <label>Success criteria:</label>
      <QuillEditor
        class="mb-4"
        theme="snow" v-model:content="success_criteria" content-type="html" />
      <label>Evidence:</label>
      <QuillEditor
        class="mb-4"
        theme="snow" v-model:content="evidence" content-type="html" />
      <o-field label="Month">
        <o-select placeholder="Select a month" v-model="month">
          <option :value="m + 1"
            v-for="m in [...Array(24).keys()]">
            Month {{m + 1}}
          </option>
        </o-select>
      </o-field>
      <o-field label="Cost">
        <o-input v-model="cost" type="number"></o-input>
      </o-field>
      <o-field label="% progress">
        <o-slider size="medium" :min="0" :max="100" v-model="completion">
          <template v-for="val in [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]" :key="val">
            <o-slider-tick :value="val">{{ val }}</o-slider-tick>
          </template>
        </o-slider>
      </o-field>
      <o-button
        @click="handleCreateSom"
        type="submit">
          Create SoM
      </o-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const props = defineProps(['proposal', 'milestone'])
import { useSoms } from '../store/soms.js'
const { createSom } = useSoms()

const title = ref('')
const outputs = ref('')
const success_criteria = ref('')
const evidence = ref('')
const cost = ref(0)
const month = ref(1)
const completion = ref(10)

const handleCreateSom = async () => {
  const response =  await createSom({
    title: title.value,
    outputs: outputs.value,
    success_criteria: success_criteria.value,
    evidence: evidence.value,
    month: month.value,
    completion: completion.value,
    cost: cost.value,
    proposal_id: props.proposal.id,
    milestone: props.milestone
  })
  if (response) {
    title.value = ''
    outputs.value = ''
    success_criteria.value = ''
    evidence.value = ''
    month.value = 1
    completion.value = 10
    cost.value = 0
  }
  console.log(response)
}
</script>

<script>
import { computed } from 'vue'

export default {
  computed: {
  }
}
</script>
