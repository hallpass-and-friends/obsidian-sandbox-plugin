import { Plugin } from "obsidian";

export class PluginWithSettings<Settings> extends Plugin {

  settings: Settings; 

	async loadSettings(defaultSettings?: Partial<Settings>) {
		this.settings = Object.assign({}, defaultSettings, await this.loadData());
	}
	async saveSettings() {
		await this.saveData(this.settings);
	}
  
}