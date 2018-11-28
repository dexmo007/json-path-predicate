<template>
  <div id="cheat-sheet">
    <div class="search-bar">
      <font-awesome-icon class="search-icon" icon="search"/>
      <input class="search-input" v-model="searchTerm" placeholder="Search for operators..."/>
    </div>
    <div class="search-results">
      <div class="operator-box" v-for="operator in filtered" :key="operator">
        <pre class="operator">{{operator}}</pre>
        <span>{{operators[operator].description+'.'}}</span>
        Example:
        <pre>{{operators[operator].example}}</pre>
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { operators } from '../lib/JsonPathPredicateParser';


export default {
  name: 'CheatSheet',
  data() {
    return {
      operators,
      searchTerm: '',
    };
  },
  computed: {
    filtered() {
      return Object.keys(operators)
        .filter(op => op.includes(this.searchTerm.toLowerCase()));
    },
  },
  components: {
    FontAwesomeIcon,
  },
};
</script>

<style scoped>
  * {
    box-sizing: border-box;
  }

  #cheat-sheet {
    margin: .5em;
    display: flex;
    flex-direction: column;
  }

  .search-bar {
    position: relative;
    margin-bottom: 5px;
  }

  .search-input {
    width: 100%;
    outline: none;
    border: none;
    border-bottom: 1px solid rgba(87, 87, 86, 0.8);
    padding: 12px 24px 12px 2em;
    color: rgba(87, 87, 86, 0.8);
    background-color: transparent;
    font-size: 14px;
    line-height: 18px;
  }

  .search-input:hover {
    color: #2b2b2b;
    border-bottom-color: #2b2b2b;
  }

  .search-input::placeholder {
    color: rgba(87, 87, 86, 0.8);
    /*color: black;*/
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  .search-input:hover::placeholder {
    color: #2b2b2b;
  }

  .search-bar:hover .search-icon {
    color: #2b2b2b;
  }

  .search-icon {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    left: .9em;
    color: rgba(87, 87, 86, 0.8);
  }

  .search-results {
    height: 100%;
    overflow-y: scroll;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }

  .operator-box {
    border: 1px solid #575757;
    margin: 3px;
  }

  .operator {
    font-weight: bold;
  }
</style>
