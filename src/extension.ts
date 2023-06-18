import * as fs from 'fs'
import * as vscode from 'vscode';
import {Project} from 'ts-morph'

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('data2ts.helloWorld', async() => {
		try {
			// get active editor and selection
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
			  vscode.window.showErrorMessage('No open text editor');
			  return;
			}
			const document = editor.document;
			const selection = editor.selection;
			const selectedText = document.getText(selection);
	  
			let varName = '';
			let isObjSelected = false;
			let objCode = '';
	  
			// determine if object or variable name was selected
			if (!selectedText) {
			  const position = selection.active;
			  const wordRange = document.getWordRangeAtPosition(position);
			  varName = document.getText(wordRange);
			  isObjSelected = true;
			} else {
			  objCode = selectedText;
			}
	  
			// parse the JS object and generate ts declaration file
			let typeName = 'any';
			try {
			  const obj = eval(`(${objCode})`);
			  if (typeof obj === 'object') {
				typeName = '{\n';
				for (const key in obj) {
				  if (Object.prototype.hasOwnProperty.call(obj, key)) {
					const value = obj[key];
					const valueType = typeof value;
					if (valueType === 'string') {
					  typeName += `  '${key}': string;\n`;
					} else if (valueType === 'number') {
					  typeName += `  '${key}': number;\n`;
					} else if (valueType === 'boolean') {
					  typeName += `  '${key}': boolean;\n`;
					}
				  }
				}
				typeName += '}';
			  }
			} catch (error) {
			  vscode.window.showErrorMessage(`Error: ${error}`);
			  return;
			}
	  
			const code = `declare const ${varName}:${typeName};\n\n`;
	  
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

