import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";

type TCodeRes = {
	resultType: string;
	startPosition: number;
};

// 考虑光标所在位置的
export const getFunctionCode = (
	code: string,
	index: number
): TCodeRes | undefined => {
	let scopePath: any;
	let resultType = "";

	// 1. 第一步解析成ast树，筛选出变量的ast
	const ast = parse(code,{
		sourceType: 'module',
		plugins: ['typescript', 'decorators-legacy'],
	  });
	traverse(ast, {
		enter(path) {
			// 判断是否是变量声明
			if (t.isVariableDeclaration(path.node)) {
				if (path.node.start! <= index && path.node.end! >= index) {
					scopePath = path;
				}
			}
		},
		VariableDeclaration(path) {
			if (!scopePath) {return;}
			// 找出光标所在位置 找到开始结束节点
			const { start, end } = path.node;
			const startPosition = scopePath.node.start;
			const endPosition = scopePath.node.end;
			if (start! >= startPosition && end! <= endPosition) {
				// 判断是否是变量定义
				if (t.isVariableDeclaration(path.node)) {
					console.log(path.node, "path.node");
					const declaration = path.node.declarations[0]; // VariableDeclarator
					if (declaration && t.isIdentifier(declaration.id)) {
						// id : obj1 标识符信息
						const typeDeclaration = getTypeDeclaration(declaration.init!); // init 是所有键值对信息
						resultType = `type T${declaration.id.name} = ${typeDeclaration}`;
					}
				}
			}
		},
	});

	// 添加映射中的类型定义
	//   const typeDefinitions = Array.from(typesMap.values())
	//     .map(({ name, value }) => `type ${name} = ${value}`)
	//     .join("\n");
	//   resultType = typeDefinitions + "\n" ;

	return { resultType, startPosition: scopePath.node.loc?.start.line };
};

// 映射用于存储已经遇到的重复类型
// const typesMap: Map<string, { name: string; value: string }> = new Map();

function objectExpressionToString(
	node: t.ObjectExpression | t.ArrayExpression
): string {
	if (t.isObjectExpression(node)) {
		return JSON.stringify(
			node.properties.map((prop) => {
				if (t.isObjectProperty(prop)) {
					return `${(prop.key as t.Identifier).name}: ${prop.value}`; // value :{value:jack type:StringLiteral  }
				}
				return "";
			})
		);
	} else {
		return JSON.stringify(node.elements);
	}
}

// 此函数将基于给定的节点类型和属性生成类型声明
function getTypeDeclaration(node: t.Node): string {
	// 判断是否是对象表达式
	if (t.isObjectExpression(node)) {
		// const objString = objectExpressionToString(node);

		// 检查是否已经存在相同的类型
		// if (typesMap.has(objString)) {
		//   return typesMap.get(objString)!.name;
		// }

		// const typeName = `T${typesMap.size}`;
		// typesMap.set(objString, { name: typeName, value: "" });

		const properties = node.properties
			.map((prop) => {
				if (t.isObjectProperty(prop)) {
					return `\n\t${(prop.key as t.Identifier).name}: ${getTypeDeclaration(
						prop.value
					)}`;
				}
				return "";
			})
			.join(" ");

		// typesMap.set(objString, { name: typeName, value: `{${properties}\n}` });
		// return typeName;
		return `{${properties}\n}`;
	} else if (t.isArrayExpression(node)) {
		const elementType =
			node.elements.length > 0 ? getTypeDeclaration(node.elements[0]!) : "any";

		// 只有数组中为对象时才提取类型
		// if (node.elements.some((element) => t.isObjectExpression(element))) {
		//   const objString = objectExpressionToString(node);

		// 检查是否已经存在相同的类型
		//   if (typesMap.has(objString)) {
		//     return typesMap.get(objString)!.name;
		//   }

		//   const typeName = `T${typesMap.size}`;
		//   typesMap.set(objString, {
		//     name: typeName,
		//     value: `${elementType}[]`,
		//   });
		//   return typeName;
		// } else {
		// }
		return `${elementType}[]`;
	} else if (t.isStringLiteral(node)) {
		return "string";
	} else if (t.isNumericLiteral(node)) {
		return "number";
	} else if (t.isBooleanLiteral(node)) {
		return "boolean";
	} else if (t.isNullLiteral(node)) {
		return "null";
	} else if (t.isIdentifier(node) && node.name === "undefined") {
		return "undefined";
	} else {
		return "any";
	}
}
