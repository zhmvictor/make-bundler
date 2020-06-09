const fs = require('fs'); // node.js 的核心模块
const path = require('path'); // node.js 的核心模块
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const babel = require('@babel/core');

const moduleAnalyser = (filename) => {
  // 分析入口文件
  const content = fs.readFileSync(filename, 'utf-8');
  // ast: 抽象语法树
  const ast = parser.parse(content, {
    sourceType: 'module'
  });

  // 分析入口文件的依赖
  const dependencies = {};
  traverse(ast, {
    ImportDeclaration({ node }) {
      const dirname = path.dirname(filename);
      const newFile = './' + path.posix.join(dirname, node.source.value);
      dependencies[node.source.value] = newFile;
    }
  });

  // 用 babel 对 ES6 语法转译成浏览器可运行的语法
  const { code } = babel.transformFromAst(ast, null, {
    presets: ['@babel/preset-env']
  });

  return {
    filename,
    dependencies,
    code,
  }
};

const moduleInfo = moduleAnalyser('./src/index.js');