import { test, expect } from "vitest";
import { getFunctionCode } from '../src/utils'

test.only('getCode', () => {

	const code = `
	const obj = {
		name:'jack',
		age:20,
		gender:'man'
	}

	const arr = [1,2,3]
	`
	const index = 10
	const variableNode = getFunctionCode(code,index)


	expect(variableNode).toEqual({
		name: 'obj',
		startPosition: { line: 2, column: 1, index: 2 },
		endPosition: { line: 6, column: 2, index: 58 }
	})


});

/*
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generator from '@babel/generator';

export const getTsDeclaration = (code: string) => {
  const ast = parse(code, { sourceType: 'module' });
  let typeDefinitions = '';

  traverse(ast, {
    VariableDeclaration(path) {
      const varName = path.node.declarations[0].id.name;
      const varType = path.node.declarations[0].init.type;

      let typeAnnotation = '';

      switch (varType) {
        case 'StringLiteral':
          typeAnnotation = 'string';
          break;
        case 'NumericLiteral':
          typeAnnotation = 'number';
          break;
        case 'NullLiteral':
          typeAnnotation = 'null';
          break;
        case 'ArrayExpression':
          typeAnnotation = 'Array<any>';
          break;
        case 'BooleanLiteral':
          typeAnnotation = 'boolean';
          break;
        default:
          break;
      }

      typeDefinitions += `let ${varName}: ${typeAnnotation};\n`;
    },
  });

  return typeDefinitions;
};

export const getVariableNode = (code: string, index: number) => {
  let variableNode;
  const ast = parse(code, { sourceType: 'module' });

  traverse(ast, {
    VariableDeclaration(path) {
      if (index === 0) {
        variableNode = path.node;
        path.stop();
      } else {
        index--;
      }
    },
  });

  return variableNode;
};





===================================





*/