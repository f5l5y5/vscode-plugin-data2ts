import * as vscode from "vscode";
import { getFunctionCode } from "./utils";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "delfunc.del",
    async () => {
      try {
        // get active editor and selection 获取当前文件 如果没有打开文件，报错
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
          vscode.window.showErrorMessage("No open text editor");
          return;
        }

		const code = editor.document.getText()
		const index = editor.document.offsetAt(editor.selection.active)

        let functionNode = getFunctionCode(code, index);

        if (!functionNode) {
          return;
        }

        /** 删除前开始到结束  行列 */
        editor?.edit((editorBuilder) => {
          editorBuilder.delete(
            new vscode.Range(
              new vscode.Position(
                functionNode!.start.line - 1,
                functionNode!.start.column
              ),
              new vscode.Position(
                functionNode!.end.line,
                functionNode!.end.column
              )
            )
          );
        });

        // 如果打开了文件，获取所有的文本内容
        // const document = editor.document;
        // const selection = editor.selection;
        // // 选择操作
        // const selectedText = document.getText(selection); // 获取选择的文本内容
        // const obj = eval(`(${selectedText})`);
        // // 未选择操作
        // const index = document.offsetAt(editor.selection.active)// 当前光标所在位置
        // const allText = document.getText()
      } catch (error) {
        vscode.window.showErrorMessage(`Error: ${error}`);
      }
    }
  );

  context.subscriptions.push(disposable);
}
