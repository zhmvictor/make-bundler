const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const moduleAnalyser = (filename) => {
  const content = fs.readFileSync(filename, 'utf-8');
  // ast: 抽象语法树
  const ast = parser.parse(content, {
    sourceType: 'module'
  });
  traverse(ast, {
    ImportDeclaration({ node }) {
      console.log(node);
    }
  });
  console.log(ast.program.body);
};

moduleAnalyser('./src/index.js');