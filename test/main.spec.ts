import { test, expect } from "vitest";
import { getFunctionCode } from '../src/utils'

test.only('getCode', () => {

	const code = `
	function getName(){
		return 'name'
	}
	function getAge1(){
		return 'age1'
	}
	`
	const index = 50
	const functionNode = getFunctionCode(code,index)


	expect(functionNode).toEqual({
		"name": "getAge1",
		start: {
			"column": 1,
			"index": 42,
			"line": 5,
		},
		end: {
			"column": 2,
			"index": 80,
			"line": 7,
		}
	})


});