import * as vscode from "vscode";
import { getFunctionCode } from "./utils"
/**
 * 
 * @param context 直接ast进行遍历生成
 */
export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "data2ts.data2ts",
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

			// 获取range范围内的内容
			// 将起始位置和结束位置转换为Range对象
			// const startPos = new vscode.Position(position.startPosition.line - 1, position.startPosition.column )
			// const endPos = new vscode.Position(position.endPosition.line, position.endPosition.column)
			// const range = new vscode.Range(startPos, endPos)

			// // 从文档对象中提取指定范围的文本
			// 	const objectText = editor.document.getText(range)
				


			/** 删除前开始到结束  行列 */
			// editor?.edit(editorBuilder => {
			// 	editorBuilder.delete(
			// 		new vscode.Range(
			// 			new vscode.Position(functionNode!.start.line - 1, functionNode!.start.column),
			// 			new vscode.Position(functionNode!.end.line, functionNode!.end.column)
			// 		)
			// 	)
			// })

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
