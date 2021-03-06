<template>
  <div class="container" :class="{mobile: isMobile}">
    <label>
      Enter a predicate
      <span v-if="!isMobile" class="hint">
        Hint: Press {{isMac ? '&#8984;' : 'Ctrl'}}+Alt+L to auto-format
      </span>
    </label>
    <div class="row" v-bind:class="{cheating: cheating, mobile: isMobile}">
      <div class="editor" v-bind:class="{error: predicate === false}">
        <editor v-model="rawPredicate" @init="predicateEditorInit" lang="json" theme="chrome"
                width="100%" height="320px"
        />
        <span v-if="predicateErrorMessage" class="error-message">
        {{predicateErrorMessage}}
      </span>
      </div>
      <div class="lapse-btn" @click="cheating = !cheating">
        <font-awesome-icon class="caret" icon="caret-left"/>
        {{cheating ? 'Hide' : 'Show'}} cheat sheet
        <i class="em em-eyeglasses"></i>
      </div>
      <CheatSheet class="cheat" v-bind:class="{'width-hidden': !cheating}"/>
    </div>
    <pre id="predicate-string" v-if="predicate">{{predicate.stringify()}}</pre>
    <label>
      Test your JSON <span class="hint">
      <span v-if="!isMobile" class="hint">
        Hint: Press {{isMac ? '&#8984;' : 'Ctrl'}}+Alt+L to auto-format
      </span>
    </span>
    </label>
    <editor v-model="rawTestJson" @init="testJsonEditorInit" lang="json" theme="chrome"
            width="100%" height="200px"></editor>
    <label>
      Results
    </label>
    <div class="result">
      <transitioning-result-icon :error="!testJson || !result"
                                 success-color="#3dff72" class="result-icon"/>
      <transition name="fade">
        <pre key="predicate" v-if="!predicate" class="error-message">
          First of all, get your predicate fixed!
        </pre>
        <pre v-else-if="!testJson" key="json" class="error-message">
          Invalid JSON
        </pre>
        <pre key="match" v-else-if="!result" class="error-message">
      Predicate not matching
    </pre>
      </transition>
    </div>
  </div>
</template>

<script lang="js">
import TransitioningResultIcon from '@dexmo/vue-transitioning-result-icon';
import aceEditor from 'vue2-ace-editor';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import CheatSheet from './CheatSheet.vue';
import JsonPathPredicateParser from '../lib/JsonPathPredicateParser';

import 'brace/ext/language_tools';
import 'brace/mode/json';
import 'brace/theme/chrome';
import { isMac, isMobile } from '../util/UserAgent';

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
  name: 'TestEditor',
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
      cheating: false,
      isMobile,
      isMac,
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
    // console.log(JsonPathPredicates.GetDefinitions());
  },
  components: {
    editor: aceEditor,
    FontAwesomeIcon,
    CheatSheet,
    TransitioningResultIcon,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .container {
    display: flex;
    flex-direction: column;
  }

  .container.mobile {
    margin-bottom: 50px;
  }

  .row {
    display: flex;
    flex-direction: row;
    width: 100%;
    max-height: 320px;
  }

  .row > * {
    height: 320px;
    max-height: 320px;
    transition: width 175ms ease-in-out;
  }

  .row > .editor, .row > .cheat {
    width: 100%;
  }

  .row.cheating:not(.mobile) > .editor, .row.cheating:not(.mobile) > .cheat {
    width: 50vw !important;
  }

  .row.cheating.mobile > .editor {
    width: 0 !important;
    margin: 0 !important;
  }

  #predicate-string {
    white-space: pre-wrap;
    word-wrap: break-spaces;
    padding-left: 1em;
    padding-right: 1em;
    margin-top: 1em;
  }

  div.error {
    border: 2px solid red;
  }

  .error-message {
    color: red;
    white-space: pre-line;
  }

  .result {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .result-icon {
    width: 70px;
  }

  .hint {
    font-size: 0.9em;
    font-style: italic;
  }

  label {
    margin-top: 1em;
    margin-bottom: 1em;
  }

  .lapse-btn {
    writing-mode: vertical-rl;
    text-orientation: mixed;
    background-color: #ebebeb;
    width: 2em;
    cursor: pointer;
  }

  .lapse-btn > i {
    transform: rotate(90deg);
  }

  .lapse-btn:hover {
    background-color: #d3d3d3;
  }

  .caret {
    transition: transform 175ms ease-in-out;
  }

  .cheating .caret {
    transform: rotate(180deg);
    transform-origin: center;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity 175ms;
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    opacity: 0;
  }
</style>
