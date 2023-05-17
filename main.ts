import { Plugin } from 'obsidian';

export default class SandboxPlugin extends Plugin {
	statusBarEl: HTMLSpanElement;

	onload() {
			this.statusBarEl = this.addStatusBarItem().createEl('span');

			this.initializeStatusBar(); //run when plugin is first turned on

			//change line count when tab changes (active file changes)
			this.app.workspace.on('active-leaf-change', async () => {
				await this.initializeStatusBar();
			});

			//change line count when doc is edited
			this.app.workspace.on('editor-change', editor => {
				const content = editor.getDoc().getValue();
				this.updateStatusBar(content);
			})
	}

	onunload(): void {
		//remove
		this.statusBarEl.textContent = '';
	}

	protected async updateStatusBar(content: string | null) {
		const newlinePattern = /\r\n|\n|\r/;	
		if (content === null) {
			this.statusBarEl.textContent = 'no lines';
		} else {
			const count = content ? content.split(newlinePattern).length : 0;
			this.statusBarEl.textContent = `${count} line` + (count === 1 ? '' : 's');	
		}
	}

	protected async initializeStatusBar() {
		let content: string | null = null;
		const activeFile = this.app.workspace.getActiveFile();
		if (activeFile) {
			content = await this.app.vault.read(activeFile);
		}
		await this.updateStatusBar(content);
	}
	
}