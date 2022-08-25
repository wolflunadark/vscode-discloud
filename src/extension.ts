import * as vscode from 'vscode';
import { upload } from './functions/explorer';

let uploadBar: vscode.StatusBarItem;

export async function activate({ subscriptions }: vscode.ExtensionContext) {

	const token = await checkIfHasToken();
	if (!token || typeof token !== "string") { return; }

	let disposable = vscode.commands.registerCommand(`discloud.upload`, async (uri) => {
		if (!token) { 
			await checkIfHasToken();
		} else {
			uploadBar.text = "$(loading) Upload App";
			functions.upload(uri, token);
			uploadBar.hide();
		}
	});

	subscriptions.push(disposable);

	uploadBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 40);
	uploadBar.command = "discloud.upload";
	uploadBar.text = "$(cloud-upload) Upload App";
	subscriptions.push(uploadBar);
	uploadBar.show();
}

export function deactivate() { }

export async function checkIfHasToken() {

	const token = vscode.workspace.getConfiguration('discloud').get('token') as string;
	if (!token || token.length < 0) {
		const ask = await vscode.window.showWarningMessage("Você não tem um Token configurado. Deseja configurar um?", {}, "Sim", "Não");
		if (ask === "Sim") {
			const input = await vscode.window.showInputBox({ prompt: "API TOKEN", title: "Coloque seu Token da API da Discloud aqui." });
			if (!input) {
				return vscode.window.showErrorMessage("Token inválido.");
			}
			vscode.workspace.getConfiguration('discloud').update('token', input);
			vscode.window.showInformationMessage("Token configurado com sucesso!");
		}
	}

	return token;
}

const functions = {

	commit: (context: vscode.ExtensionContext) => {
		vscode.window.showInformationMessage("aqui");
	},
	upload,
	delete: (context: vscode.ExtensionContext) => { },
	start: (context: vscode.ExtensionContext) => { },
	stop: (context: vscode.ExtensionContext) => { },
	restart: (context: vscode.ExtensionContext) => { },
	logs: (context: vscode.ExtensionContext) => { },
	backup: (context: vscode.ExtensionContext) => { },
	ram: (context: vscode.ExtensionContext) => { },
};