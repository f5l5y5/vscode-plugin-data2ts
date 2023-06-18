import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('data2ts.helloWorld', async () => {
		try {
			// get active editor and selection 获取当前文件 如果没有打开文件，报错
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				vscode.window.showErrorMessage('No open text editor');
				return;
			}
			// 获取到选中的文本 
			const document = editor.document;
			const selection = editor.selection;
			const selectedText = document.getText(selection);

			let varName = 'Txx';
			// let isObjSelected = false;
			// let objCode = '';

			// 判断选中的文本是否是一个变量
			// if(selectedText){
			// 	const position = selection.active;
			// 	const wordRange = document.getWordRangeAtPosition(position);
			// 	varName = document.getText(wordRange)
			// 	const varLine = document.lineAt(wordRange.start.line).text;
			// 	const varMatch = varLine.match(new RegExp(`\\b(let|const)\\s+${varName}\\b`));
			// }

			// 判断类型
			function getType(val: any): string {
				const typeStr = Object.prototype.toString.call(val);
				return typeStr.slice(8, -1).toLowerCase();
			}

			// parse the JS object and generate ts declaration file
			// const isTypeOrInterface = 'type'
			let typeName = 'any';
			try {
				const obj = eval(`(${selectedText})`);
				if (typeof obj === 'object') {
					typeName = '{\n';
					for (const key in obj) {
						if (Object.prototype.hasOwnProperty.call(obj, key)) {
							// 判断不是object或者是array
							typeName += `  ${key}: ${getType(obj[key])}\n`;
						}
					}
					typeName += '}';
				}
			} catch (error) {
				vscode.window.showErrorMessage(`Error: ${error}`);
				return;
			}

			const code = `type ${varName} = ${typeName}\n\n`;

			// find the previous empty line and insert the declaration
			const startPos = new vscode.Position(Math.max(selection.start.line - 1, 0), 0);
			const newText = code;

			await editor.edit(editBuilder => {
				editBuilder.insert(startPos, newText);
			});
		} catch (error) {
			vscode.window.showErrorMessage(`Error: ${error}`);
		}
	});

	context.subscriptions.push(disposable);
}

