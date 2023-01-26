module.exports = {
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:vue/vue3-strongly-recommended',
    'prettier'
  ],
  rules: {
    'vue/no-v-html': 'off'
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
  }
}
