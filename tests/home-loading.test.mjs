import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

const source = readFileSync(new URL('../dist/app.js', import.meta.url), 'utf8');
const renderSource = source.slice(source.indexOf('function render('), source.indexOf('function pruneCart('));

test('home renders during slow or failed catalog requests in both languages', () => {
  for (const path of ['', 'home']) for (const state of ['loading', 'backend', 'ready']) for (const lang of [0, 1]) {
    const main = {};
    const context = vm.createContext({
      route: () => ({path, params: new URLSearchParams()}),
      isAdmin: false, catalogState: state, lang,
      header() {}, home: () => `hero-${lang}`, $: selector => selector === '#main' ? main : null
    });
    vm.runInContext(renderSource, context);
    context.render();
    assert.equal(main.innerHTML, `hero-${lang}`);
  }
});

test('catalog and admin still show loading until their data is available', () => {
  for (const isAdmin of [false, true]) {
    const main = {};
    const context = vm.createContext({
      route: () => ({path: isAdmin ? '' : 'catalog', params: new URLSearchParams()}),
      isAdmin, catalogState: 'loading', header() {}, t: value => value,
      page: (title, content) => title + content, $: selector => selector === '#main' ? main : null
    });
    vm.runInContext(renderSource, context);
    context.render();
    assert.match(main.innerHTML, /loading/);
    assert.match(main.innerHTML, isAdmin ? /admin/ : /shop/);
  }
});
