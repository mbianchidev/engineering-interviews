import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import path from 'node:path';
import { test } from 'node:test';

interface AstNode {
  type: string;
  nodes?: AstNode[];
  parent?: AstNode;
  open?: boolean;
  close?: boolean;
  commas?: number;
}

interface BraceOptions {
  maxDepth?: number;
}

interface Braces {
  parse(input: string, options?: BraceOptions): AstNode;
  compile(input: string | AstNode, options?: BraceOptions): string;
  expand(input: string | AstNode, options?: BraceOptions): string[];
  stringify(input: string | AstNode, options?: BraceOptions): string;
}

const projectRequire = createRequire(path.join(process.cwd(), 'package.json'));
const pluginRequire = createRequire(projectRequire.resolve('@next/eslint-plugin-next'));
const globRequire = createRequire(pluginRequire.resolve('fast-glob'));
const matcherRequire = createRequire(globRequire.resolve('micromatch'));
const braces: Braces = matcherRequire('braces');

function nestedAst(depth: number): AstNode {
  const root: AstNode = { type: 'root', nodes: [] };
  let parent = root;
  for (let i = 0; i < depth; i++) {
    const child: AstNode = { type: 'brace', nodes: [], parent, open: true, close: true, commas: 1 };
    parent.nodes = [child];
    parent = child;
  }
  return root;
}

test('brace matching retains ordinary expansion, compilation, and stringification', () => {
  assert.deepEqual(braces.expand('synthetic/{alpha,beta}'), ['synthetic/alpha', 'synthetic/beta']);
  assert.deepEqual(braces.expand('item-{1..3}'), ['item-1', 'item-2', 'item-3']);
  assert.equal(braces.compile('synthetic/{alpha,beta}'), 'synthetic/(alpha|beta)');
  assert.equal(braces.stringify(braces.parse('synthetic/{alpha,beta}')), 'synthetic/{alpha,beta}');
});

test('brace and parenthesis nesting is bounded even when callers request a larger limit', () => {
  for (const [open, close] of [['{', '}'], ['(', ')']]) {
    for (const method of [braces.parse, braces.compile, braces.expand, braces.stringify]) {
      assert.doesNotThrow(() => method(open.repeat(100) + 'synthetic' + close.repeat(100)));
      assert.throws(() => method(open.repeat(101) + 'synthetic' + close.repeat(101)), /exceeds max depth \(100\)/);
      assert.throws(() => method(open.repeat(101) + 'synthetic' + close.repeat(101), { maxDepth: 1000 }), /exceeds max depth \(100\)/);
      assert.throws(() => method(open.repeat(3) + 'synthetic' + close.repeat(3), { maxDepth: 2 }), /exceeds max depth \(2\)/);
    }
  }
});

test('recursive brace walkers also bound caller-provided AST depth', () => {
  for (const method of [braces.compile, braces.expand, braces.stringify]) {
    assert.doesNotThrow(() => method(nestedAst(100)));
    assert.throws(() => method(nestedAst(101)), /exceeds max depth \(100\)/);
    assert.throws(() => method(nestedAst(101), { maxDepth: 1000 }), /exceeds max depth \(100\)/);
  }
});
