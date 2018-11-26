<template>
  <div class="container">
    <label>
      Enter a predicate <span class="hint">Hint: Press Ctrl+Alt+L to auto-format</span>

    </label>
    <div v-bind:class="{error: predicate === false}">
      <editor v-model="rawPredicate" @init="predicateEditorInit" lang="json" theme="chrome"
              width="100%" height="320px"
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
    <div v-if="!predicate">
      <font-awesome-icon icon="times-circle" class="result-icon"></font-awesome-icon>
      <pre>
        First of all, get your predicate fixed!
      </pre>
    </div>
    <div v-else-if="!testJson || !result" class="error-message">
      <div class="result-icon error-icon">
        <font-awesome-icon icon="times-circle"></font-awesome-icon>
      </div>
      <pre v-if="!testJson">
      Invalid JSON
    </pre>
      <pre v-else-if="!result" class="error-message">
      Predicate not matching
    </pre>
    </div>
    <div v-else class="result-icon success-icon">
      <font-awesome-icon icon="check-circle"/>
    </div>
  </div>
</template>

<script lang="js">
import aceEditor from 'vue2-ace-editor';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import JsonPathPredicateParser from '../lib/JsonPathPredicateParser';

import 'brace/ext/language_tools';
import 'brace/mode/json';
import 'brace/theme/chrome';

function reformat(jsonString) {
  try {
    return JSON.stringify(JSON.parse(jsonString), undefined, 2);
  } catch (_) {
    return jsonString;
  }
}

// noinspection JSUnusedGlobalSymbols used by command manager
const autoFormatCommand = {
  name: 'AutoFormat',
  bindKey: {
    win: 'Ctrl-Alt-l',
    mac: 'Command-Alt-l',
  },
  exec: (editor) => {
    console.log('reformatting');
    editor.setValue(reformat(editor.getValue()), 1);
  },
};

export default {
  name: 'HelloWorld',
  data() {
    return {
      rawPredicate: JSON.stringify({
        $and: [
          '$.foo',
          {
            $eq: [
              '$.foo', '$.bar',
            ],
          },
          {
            $gt: {
              '$.zick': '$.zack',
            },
          },
          {
            $in: {
              '$.zick': '$.zz',
            },
          },
          {
            $regex: {
              '$.foo': /^\s*$/.source,
            },
          },
        ],
      }, undefined, 2),
      predicate: null,
      predicateErrorMessage: null,
      rawTestJson: JSON.stringify({
        foo: '',
        bar: '',
        zick: 1,
        zack: 0,
        zz: [0, 1],
      }, undefined, 2),
      testJson: null,
    };
  },
  methods: {
    testJsonEditorInit(e) {
      e.on('change', () => {
        try {
          this.testJson = JSON.parse(e.getValue());
        } catch (error) {
          this.testJson = null;
        }
      });
      e.commands.addCommand(autoFormatCommand);
    },
    predicateEditorInit(e) {
      e.on('change', () => {
        this.predicateErrorMessage = null;
        if (e.getValue()
          .trim() === '') {
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
      e.commands.addCommand(autoFormatCommand);
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
    this.predicate = JsonPathPredicateParser.parse(this.rawPredicate);
    this.testJson = JSON.parse(this.rawTestJson);
  },
  components: {
    editor: aceEditor,
    FontAwesomeIcon,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .container {
    display: flex;
    flex-direction: column;
  }

  div.error {
    border: 2px solid red;
  }

  .error-message {
    color: red;
  }

  .result-icon {
    font-size: 3em;
  }

  .error-icon {
    color: red;
  }

  .success-icon {
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
