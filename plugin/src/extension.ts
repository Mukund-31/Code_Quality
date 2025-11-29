import * as vscode from 'vscode';
import { SidebarProvider } from './SidebarProvider';

export function activate(context: vscode.ExtensionContext) {
    const sidebarProvider = new SidebarProvider(context.extensionUri);

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            "code-quality-view",
            sidebarProvider
        )
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('code-quality.login', () => {
            vscode.commands.executeCommand('workbench.view.extension.code-quality-sidebar');
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('code-quality.reviewFile', async () => {
            vscode.commands.executeCommand('workbench.view.extension.code-quality-sidebar');
            // The actual review will be triggered from the webview
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('code-quality.reviewRepo', async () => {
            vscode.commands.executeCommand('workbench.view.extension.code-quality-sidebar');
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('code-quality.reviewPR', async () => {
            vscode.commands.executeCommand('workbench.view.extension.code-quality-sidebar');
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('code-quality.browseRepos', async () => {
            vscode.commands.executeCommand('workbench.view.extension.code-quality-sidebar');
        })
    );
}

export function deactivate() { }
