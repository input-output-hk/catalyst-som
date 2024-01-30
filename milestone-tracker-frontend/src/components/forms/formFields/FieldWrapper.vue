<template>
  <o-field
    :class="{
      required: props.required,
    }"
    :variant="variant"
    :clearable="!props.required"
    class="field-wrapper"
  >
    <slot />

    <template #label>
      <p>{{ props.label }}<br />
        <span v-if="props.help" class="help-description">{{ props.help }}</span>
      </p>
    </template>
    <template #message>
      <ul v-if="props.validation.errors.length">
        <li
          v-for="error in props.validation.errors"
          :key="error"
        >
          {{ error }}
        </li>
      </ul>
    </template>
  </o-field>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  help: {
    type: String,
    default: "",
  },
  required: {
    type: Boolean,
    default: false,
  },
  validation: {
    type: Object,
    default: () => ({}),
  },
  default: {
    default: undefined
  }
});

const variant = computed(() => {
  if (props.validation.errorMessage) {
    return "danger";
  } else if (props.validation.meta.valid && props.validation.meta.dirty) {
    return "success";
  }
  return "";
});
</script>

<style lang="scss" scoped>
.field-wrapper {
  margin-bottom: 1rem;
}
label {
  .help-description {
    font-weight: 400;
    font-size: 0.8em;
  }
}
</style>
