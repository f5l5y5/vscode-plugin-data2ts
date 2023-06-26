import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import generator from '@babel/generator'


	const code = `
	const obj = {
			name: "jack",
			age: 18,
			sex: 'man',
			arr:[1,2,3],
			obj:{a:1},
			arrobj:[{c:2}]				
			}

	const arr = [1,2,3]
	`
	
const ast = parse(code)
	
traverse(ast, {
	enter(path) {
		const {start,end} = path.node
		if (start! < 2 || end! > 116) {
			path.remove()
		}
	}
})


const generatorCode = generator(ast, {}, code)
console.log('打印***generatorCode',generatorCode)






