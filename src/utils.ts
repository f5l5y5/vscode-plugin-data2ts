import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import generator from "@babel/generator";

interface FunctionNode {
  name: string;
  start: {
    column: number;
    index: number;
    line: number;
  };
  end: {
    column: number;
    index: number;
    line: number;
  };
}

// 考虑光标所在位置的
export const getFunctionCode = (
  code: string,
  index: number
): FunctionNode | undefined => {
  let functionNode;
  const ast = parse(code);
  traverse(ast, {
    FunctionDeclaration(path) {
      console.log(path);
      if (index >= path.node?.start! && index <= path.node?.end!) {
        functionNode = {
          name: path.node.id?.name,
          start: path.node.loc?.start,
          end: path.node.loc?.end,
        };
      }
    },
  });
  return functionNode;
};

// export const getTsDeclaration = (code: string) => {
// 	const ast = parse(code)
// 	traverse(ast, {
// 		// VariableDeclaration(path) {
// 		// 	console.log('打印***声明',path)
// 		// 	// if()

// 		// },
// 		ObjectProperty(path) {
// 			console.log('打印***ObjectProperty', path.node)
// 			const node = path.node.value
// 			// 'NumericLiteral' 'StringLiteral' 'NullLiteral' 'ArrayExpression'  'BooleanLiteral',
// 			if (node.type === 'StringLiteral') {
// 				node.value = 'string'
// 			}
// 			if(node.type==='NumericLiteral'){
// 				node.type = 'StringLiteral'
// 				// node.value = 'number'
// 			}
// 			if(node.type==='NullLiteral'){
// 				// node.value = 'null'
// 			}
// 			if(node.type==='ArrayExpression'){
// 				// node.value = 'Array<any>'
// 			}
// 			if(node.type==='BooleanLiteral'){
// 				// node.value = 'boolean'
// 			}
// 		}

// 	})

// 	console.log('=======>',generator(ast))

// }
