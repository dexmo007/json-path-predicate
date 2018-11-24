<template>
  <div class="container">
    <label for="predicate">
      JSON Path Predicate

    </label>
    <textarea class="form-textarea" rows="6" v-bind:class="{error: predicate === false}"
              id="predicate"
              v-model="rawPredicate" v-on:keyup="buildPredicate">
    </textarea>
    <pre v-if="predicate">{{predicate.constructor.name}}</pre>
    <label for="testJson">
      Test your JSON
    </label>
    <textarea class="form-textarea" rows="6" v-bind:class="{error: !testJson}" id="testJson"
              v-model="rawTestJson" v-on:keyup="tryParseJson">
    </textarea>
    <label>
      Results
    </label>
    <pre>
      {{result}}
    </pre>
  </div>
</template>

<script lang="js">
import JsonPathPredicate from '../lib/JsonPathPredicate';

export default {
  name: 'HelloWorld',
  data() {
    return {
      rawPredicate: '{"$and":["$.foo", "$.bar"]}',
      predicate: null,
      rawTestJson: '{}',
      testJson: null,
    };
  },
  methods: {
    buildPredicate() {
      if (this.rawPredicate === '') {
        this.predicate = null;
        return;
      }
      try {
        this.predicate = JsonPathPredicate.parse(this.rawPredicate);
      } catch (e) {
        // console.error(e);
        this.predicate = false;
      }
    },
    tryParseJson(e) {
      if (e.key === 'l' && e.ctrlKey && e.altKey) {
        console.log('Reformatting');
        try {
          this.rawTestJson = JSON.stringify(JSON.parse(this.rawTestJson), undefined, 2);
        } catch (_) {
          // ignore
        }
        return;
      }
      try {
        this.testJson = JSON.parse(this.rawTestJson);
      } catch (error) {
        this.testJson = null;
      }
    },
  },
  computed: {
    result() {
      if (!this.predicate || !this.testJson) {
        return null;
      }
      return this.predicate.test(this.testJson);
    },
  },
  created() {
    this.buildPredicate();
    this.tryParseJson({});
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .container {
    display: flex;
    flex-direction: column;
  }

  .form-textarea {
    border: 2px solid greenyellow;
  }

  textarea.error {
    border: 2px solid red;
  }

  label {
    margin-top: 1em;
    margin-bottom: 1em;
  }
</style>
