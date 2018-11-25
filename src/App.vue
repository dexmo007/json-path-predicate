<template>
  <div id="app">
    <div id="header">
      <img id="logo" src="./assets/dexmo-icon.png" alt="DexmoHQ Logo"/>
      <h1>JSON Path Predicates</h1>
    </div>
    <HelloWorld/>
  </div>
</template>

<script lang="js">
import HelloWorld from './components/HelloWorld.vue';

export default {
  name: 'app',
  components: {
    HelloWorld,
  },
};
</script>

<style>
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
</style>
