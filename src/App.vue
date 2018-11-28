<template>
  <div id="app">
    <GitHubCorner/>
    <div id="header">
      <img id="logo" src="./assets/dexmo-icon.png" alt="DexmoHQ Logo"/>
      <h1>JSON Path Predicates</h1>
    </div>
    <TestEditor/>
  </div>
</template>

<script lang="js">
import TestEditor from './components/TestEditor.vue';
import GitHubCorner from './components/GitHubCorner.vue';

export default {
  name: 'app',
  components: {
    TestEditor,
    GitHubCorner,
  },
};
</script>

<style>
  @import 'https://afeld.github.io/emoji-css/emoji.css';

  body {
    margin: 0;
    padding: 0;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  #header {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #logo {
    width: 70px;
    margin-right: 10px;
  }

  .width-hidden {
    width: 0 !important;
    margin: 0 !important;
    max-width: 0 !important;
    padding: 0 !important;
  }

  .width-hidden * {
    width: 0 !important;
    margin: 0 !important;
    max-width: 0 !important;
    padding: 0 !important;
  }
</style>
