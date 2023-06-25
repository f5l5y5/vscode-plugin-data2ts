import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import generator from '@babel/generator'
import * as t from '@babel/types'

// 考虑光标所在位置的
export const getFunctionCode = (code: string, index: number) => {
	let scopePath:any
	// 1. 第一步解析成ast树，筛选出变量的ast
	const ast = parse(code)
	traverse(ast, {
		enter(path) {
			// 判断是否是变量声明
			if (t.isVariableDeclaration(path.node)) {
				if (path.node.start! <= index && path.node.end! >= index) {
					console.log('打印***path.node',path.node.declarations[0].id)
					scopePath =  path
					// switch (varType) {
					// 	case 'StringLiteral':
					// 		typeAnnotation = 'string'
					// 		break
					// 	case 'NumericLiteral':
					// 		typeAnnotation = 'number'
					// 		break
					// 	case 'NullLiteral':
					// 		typeAnnotation = 'null'
					// 		break
					// 	case 'ArrayExpression':
					// 		typeAnnotation = 'Array<any>'
					// 		break
					// 	case 'BooleanLiteral':
					// 		typeAnnotation = 'boolean'
					// 		break
					// 	default:
					// 		break
					// }

				}
			}
		}
	})

	// // 如果没有找到路径则直接返回
	if (!scopePath) {
		return undefined
	}
	const startPosition = scopePath.node.start
	const endPosition = scopePath.node.end

	return {
		// name: scopePath.node.declarations[0].id.type,
		name: 'obj',
		startPosition: scopePath.node.loc?.start,
		endPosition: scopePath.node.loc?.end
	}
	
}


