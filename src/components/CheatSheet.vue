<template>
  <div id="cheat-sheet">
    <div class="search-bar">
      <input class="search__input" v-model="searchTerm" placeholder="Search for operators..."/>
    </div>
    <div class="search-results">
      <div class="operator-box" v-for="operator in filtered" :key="operator">
        <pre class="operator">{{operator}}</pre>
        <span>{{operators[operator].description+'.'}}</span>
        Example:<pre>{{operators[operator].example}}</pre>
      </div>
    </div>
  </div>
</template>

<script>
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
        .filter(op => op.includes(this.searchTerm));
    },
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
  .search__input {
    width: 100%;
    padding: 12px 24px;

    background-color: transparent;
    /*transition: transform 250ms ease-in-out;*/
    font-size: 14px;
    line-height: 18px;

    color: #575756;
    background-image: url(http://mihaeltomic.com/codepen/input-search/ic_search_black_24px.svg);
    background-repeat: no-repeat;
    background-size: 18px 18px;
    background-position: 95% center;
    border-radius: 50px;
    border: 1px solid #575756;
    transition: all 250ms ease-in-out;
    backface-visibility: hidden;
    transform-style: preserve-3d;
  }

  .search__input::placeholder {
    color: rgba(87, 87, 86, 0.8);
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  .search__input:hover,
  .search__input:focus {
    padding: 12px 0;
    outline: 0;
    border: 1px solid transparent;
    border-bottom: 1px solid #575756;
    border-radius: 0;
    background-position: 100% center;
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
