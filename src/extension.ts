import * as vscode from "vscode";
import { getFunctionCode } from "./utils"


/**
 * 
 * @param context 直接ast进行遍历生成
 */
export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "yinuo.data2ts",
    async () => {
      try {
			// get active editor and selection 获取当前文件 如果没有打开文件，报错
			const editor = vscode.window.activeTextEditor
			if (!editor) {
				vscode.window.showErrorMessage('No open text editor')
				return
			}

			const code = editor.document.getText()
			const index = editor.document.offsetAt(editor.selection.active)

			let result = getFunctionCode(code, index)
			if(!result){
				return
			}
			const {startPosition,resultType} = result

			if (!resultType) {
				return
			}

			// find the previous empty line and insert the declaration
			const startPos = new vscode.Position(startPosition - 2, 0)

			await editor.edit(editBuilder => {
				editBuilder.insert(startPos, resultType)
			})
		} catch (error) {
        vscode.window.showErrorMessage(`Error: ${error}`);
      }
    }
  );

  context.subscriptions.push(disposable);
}
