import { App, Modal, Setting } from "obsidian";
import { SingleKeyValuePair } from "./kvp.models";

export type SubmitFn = (key: string, newKey: string, newValue: string) => void;

export class KeyValuePairModal extends Modal {
  protected _originalKey: string;  //immutable
  protected kvp: SingleKeyValuePair;
  protected onSubmit: SubmitFn;

  constructor(
    app: App,
    key: string,
    value: string,
    onSubmit: SubmitFn
  ) {
    super(app);
    this._originalKey = key;
    this.kvp = {key,value};
    this.onSubmit = onSubmit;
  }

  onOpen() {

    const { modalEl, contentEl, titleEl } = this;
    modalEl.addClass('kvp-modal');
    titleEl.textContent = 'KVP Editor';
    contentEl.createEl("h3", { text: this.kvp.key || '** New Entry **' });

    //key editor
    new Setting(contentEl).setName("Key").addText((text) => {
      text.inputEl.style.width = "100%";
      text.setValue(this.kvp.key)
        .onChange((value) => {
          this.kvp.key = value;
        });
    }).setClass('kvp-modal-item');

    //value editor
    new Setting(contentEl).setName("Value").addTextArea((text) => {
      text.inputEl.rows = 15;
      text.inputEl.style.width = "100%";

      text.setValue(this.kvp.value)
        .onChange((value) => {
          this.kvp.value = value;
        });
    }).setClass('kvp-modal-item');

    //save button
    new Setting(contentEl).addButton((btn) => {
      btn.setButtonText("Save")
        .setCta()
        .onClick(() => {
          if (!this.kvp.key) { 
            //todo: show error
          } else {
            this.close();
            this.onSubmit(this._originalKey, this.kvp.key, this.kvp.value);              
          }
        });
    });    
  }

  onClose(): void {
      const { contentEl } = this;
      contentEl.empty();
  }
}