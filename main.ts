import { App, Modal, Notice, PluginSettingTab, Setting } from 'obsidian';

import CsvEditor from 'features/csv-editor';
import FeaturesAbstract from 'features/features.abstract';
import TrackLines from 'features/track-lines';
import KvpEditor from 'features/key-value-pair/kvp-editor';
import { isAsyncFunction } from 'util/types';
import { PluginWithSettings } from 'plugin-with-settings';
import { SamplePluginSettings, defaultSamplePluginSettings } from 'main.settings';
import { PasswordManager } from 'features/key-value-pair/password-manager';


export default class SandboxPlugin extends PluginWithSettings<SamplePluginSettings> {
	features: FeaturesAbstract[];
	settings: SamplePluginSettings;

	async onload() {
		await this.loadSettings(defaultSamplePluginSettings);

		this.features = [
			new TrackLines(this),
			new CsvEditor(this),
			new KvpEditor(this),
		];

		this.features.forEach(async (feature) => {
			if (isAsyncFunction(feature.onload)) {
				await feature.onload();
			} else {
				feature.onload();
			}
		});

		//hmm
		const guid = PasswordManager.getRandomGuid();
		console.log("Random UUID", {
			type: typeof(guid),
			length: guid.length,
			guid
		});

		const pwd_length = 16;
		const pwd = PasswordManager.getRandomString(pwd_length, true);
		console.log('Random Password', {
			type: typeof(pwd),
			length: pwd.length,
			pwd
		});
		const hash = PasswordManager.hash(pwd, guid);
		console.log('Password Hash', {
			type: typeof(hash),
			length: hash.length,
			hex: { len: hash.toString('hex').length, txt: hash.toString('hex')},
			base64: { len: hash.toString('base64').length, txt: hash.toString('base64')},
		});

    //testing
    const ribbonIconEl = this.addRibbonIcon('dice', 'Hello Plugin', (ev) => {
      new Notice('This is a nice plugin');
    });
    ribbonIconEl.addClass('my-plugin-ribbon');
    this.addCommand({
      id: 'open-sample-modal-simple',
      name: 'Open sample modal (simple)',
      callback: () => {
        new SampleModal(this.app).open();
      }
    });
    this.addCommand({
      id: 'open-sample-modal-complex',
      name: 'Open sample modal (complex)',
      checkCallback: (checking) => {
        const file = this.app.workspace.getActiveFile();
        if (file?.extension === 'kvp') {
          if (!checking) {
            new SampleModal(this.app).open();
          }
          return true;
        } else {
					console.log("CHECK FAILED", file);
				}
      }
    });
    this.addSettingTab(new SampleSettingTab(this.app, this));

    this.registerDomEvent(document, 'keyup', (ev) => {
      if (ev.ctrlKey) {
        console.log("KEYUP", ev);
      }
    });

	}

	onunload(): void {
		this.features.forEach(feature => {
			feature.onunload();
		});
	}
	
}


class SampleModal extends Modal {
  constructor(app: App) {
    super(app);
  }

  onOpen(): void {
      const {contentEl} = this;
      contentEl.setText('Wow - a modal!');
  }
  onClose(): void {
      this.containerEl.empty();
  }
}

class SampleSettingTab extends PluginSettingTab {
  plugin: PluginWithSettings<SamplePluginSettings>;

  constructor(app: App, plugin: PluginWithSettings<SamplePluginSettings>) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
      this.containerEl.empty();

      this.containerEl.createEl('h2', {text: 'Setting for my plugin'});

      new Setting(this.containerEl)
        .setName('Name')
        .setDesc('Shh... this is a secret')
        .addText(text => {
          text.setPlaceholder('Enter the GUID')
            .setValue(this.plugin.settings.hush.guid)
            .onChange(async (value) => {
              console.log("Name", value);
							this.plugin.settings.hush.guid = value;
							await this.plugin.saveSettings();
            })
        })
  }
}