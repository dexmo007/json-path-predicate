<template>
  <div class="container">
    <label>
      Enter a predicate <span class="hint">Hint: Press Ctrl+Alt+L to auto-format</span>

    </label>
    <div v-bind:class="{error: predicate === false}">
      <editor v-model="rawPredicate" @init="predicateEditorInit" lang="json" theme="chrome"
              width="100%" height="300px"
      />
      <span v-if="predicateErrorMessage" class="error-message">
        {{predicateErrorMessage}}
      </span>
    </div>
    <pre v-if="predicate">{{predicate.stringify()}}</pre>
    <label>
      Test your JSON <span class="hint">Hint: Press Ctrl+Alt+L to auto-format</span>
    </label>
    <editor v-model="rawTestJson" @init="testJsonEditorInit" lang="json" theme="chrome"
            width="100%" height="200px"></editor>
    <label>
      Results
    </label>
    <pre v-if="!testJson">
      Invalid JSON
    </pre>
    <pre v-if="!result" class="error-message">
      Predicate not matching
    </pre>
    <pre v-else class="success-message">
      Matching
    </pre>
  </div>
</template>

<script lang="js">
import aceEditor from 'vue2-ace-editor';
import JsonPathPredicateParser from '../lib/JsonPathPredicateParser';

import 'brace/ext/language_tools';
import 'brace/mode/json';
import 'brace/theme/chrome';

function isReformat(e) {
  return e.key === 'l' && e.ctrlKey && e.altKey;
}

function reformat(jsonString) {
  try {
    return JSON.stringify(JSON.parse(jsonString), undefined, 2);
  } catch (_) {
    return jsonString;
  }
}

export default {
  name: 'HelloWorld',
  data() {
    return {
      rawPredicate: '{"$and":["$.foo", "$.bar", {"$eq": ["$.zick","$.zack"]},{"$or":["$.harry","$.potter"]}]}',
      predicate: null,
      predicateErrorMessage: null,
      rawTestJson: '{"foo":"","bar":0,"zick":0,"zack":0,"potter":0,"harry":0}',
      testJson: null,
    };
  },
  methods: {
    buildPredicate(e) {
      if (isReformat(e)) {
        this.rawPredicate = reformat(this.rawPredicate);
        return;
      }
      if (this.rawPredicate === '') {
        this.predicate = null;
        return;
      }
      try {
        this.predicate = JsonPathPredicateParser.parse(this.rawPredicate);
      } catch (error) {
        // console.error(error);
        this.predicate = false;
      }
    },
    tryParseJson(e) {
      if (isReformat(e)) {
        this.rawTestJson = reformat(this.rawTestJson);
        return;
      }
      try {
        this.testJson = JSON.parse(this.rawTestJson);
      } catch (error) {
        this.testJson = null;
      }
    },
    testJsonEditorInit(e) {
      e.on('change', () => {
        try {
          this.testJson = JSON.parse(e.getValue());
        } catch (error) {
          this.testJson = null;
        }
      });
      e.commands.addCommand({
        name: 'AutoFormat',
        bindKey: {
          win: 'Ctrl-Alt-l',
          mac: 'Command-Alt-l',
        },
        exec: (editor) => {
          console.log('reformatting');
          editor.setValue(reformat(editor.getValue()), 1);
        },
      });
    },
    predicateEditorInit(e) {
      e.on('change', () => {
        this.predicateErrorMessage = null;
        if (e.getValue().trim() === '') {
          this.predicate = null;
          return;
        }
        try {
          this.predicate = JsonPathPredicateParser.parse(e.getValue());
        } catch (error) {
          // console.error(error);
          this.predicate = false;
          this.predicateErrorMessage = error.message;
        }
      });
      e.commands.addCommand({
        name: 'AutoFormat',
        bindKey: {
          win: 'Ctrl-Alt-l',
          mac: 'Command-Alt-l',
        },
        exec: (editor) => {
          console.log('reformatting');
          editor.setValue(reformat(editor.getValue()), 1);
        },
      });
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
    this.buildPredicate({
      key: 'l',
      ctrlKey: true,
      altKey: true,
    });
    this.tryParseJson({
      key: 'l',
      ctrlKey: true,
      altKey: true,
    });
    this.buildPredicate({});
    this.tryParseJson({});
  },
  components: {
    editor: aceEditor,
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

  textarea.error, div.error {
    border: 2px solid red;
  }

  .error-message {
    color: red;
  }

  .success-message {
    color: #3dff72;
  }

  .hint {
    font-size: 0.9em;
    font-style: italic;
  }

  label {
    margin-top: 1em;
    margin-bottom: 1em;
  }
</style>
