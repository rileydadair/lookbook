module.exports = {
  extends: [
    'plugin:vue/essential'
  ],
  rules: {
    "vue/no-unused-components": ["error", {
      "ignoreWhenBindingPresent": false
    }]
  }
}