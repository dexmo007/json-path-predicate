import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import HelloWorld from '@/components/HelloWorld.vue';
import App from '@/App.vue';
import GitHubCorner from '@/components/GitHubCorner.vue';

describe('App.vue', () => {
  it('builds the app', () => {
    const wrapper = shallowMount(App);
    expect(wrapper.find(GitHubCorner)).to.exist;
    expect(wrapper.find(HelloWorld)).to.exist;
  });
});
