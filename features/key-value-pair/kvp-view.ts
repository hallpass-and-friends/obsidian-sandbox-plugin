import { TextFileView, WorkspaceLeaf } from "obsidian";
import { KeyValuePairRepo } from "./kvp-repo";
import { KeyValuePairModal, SubmitFn } from "./kvp-modal";
import { SingleKeyValuePair } from "./kvp.models";
//import { HushHushService } from "./hush-hush.service";

export const VIEW_TYPE_KVP = "kvp-view";

const CSS_UPDATED = "updated";
const CSS_NEW = "new";
export class KvpView extends TextFileView {
  repo: KeyValuePairRepo;
  wrapper: HTMLElement;

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
    this.repo = new KeyValuePairRepo();

    console.log("Vault Name", this.app.vault.getName());
    console.log("Vault Root", this.app.vault.getRoot());
    
    const KEY = "HallpassObsidian";
    if (process.env[KEY]) {
      console.log('GUID - found', process.env[KEY]);
    } else {
      process.env[KEY] = crypto.randomUUID();
      console.log('GUID - had to reset', process.env[KEY]);
    }

  }

  async onOpen() {
    this.wrapper = this.contentEl.createEl("div");
    this.wrapper.classList.add('kvp-view');
  }
  async onClose() {
    this.contentEl.empty();
  }


  getViewData(): string {
      return this.repo.toJson();
  }

  setViewData(data: string, clear: boolean): void {
      this.repo.load(data);
      console.log("debug: ", this.repo);
      this.refresh();
  }

  clear(): void {
      this.repo.clear();
  }

  getViewType(): string {
      return VIEW_TYPE_KVP;
  }

  refresh() {
    //remove old data
    this.wrapper.empty();

    const data = this.repo.get();

    Object.keys(data).forEach(key => {
        this.addKvpElement(key, data[key]);
    });

    //build the 'add new item' button
    const btnEl = this.wrapper.createEl('button');
    btnEl.classList.add('kvp-add-new-item');
    btnEl.textContent = '+ NEW';
    btnEl.onclick = (() => {
      this.addNewEntry();
    });
  }

  protected addKvpElement(key: string, value: string, isNew?: boolean) {
    const kvp = this.wrapper.createEl('div');
    kvp.classList.add('kvp');
    kvp.classList.toggle(CSS_NEW, isNew === true);
    
    const keyEl = kvp.createEl('div');
    keyEl.classList.add('key');
    keyEl.textContent = key;

    const valueEl = kvp.createEl('div');
    valueEl.classList.add('value');
    valueEl.textContent = value;

    //click anywhere, get the editor
    kvp.onclick = (ev) => {
      this.edit({key, value: value}, kvp);
    }    
  }

  protected edit(kvp: SingleKeyValuePair, wrapper: HTMLDivElement) {

    const keyEl =  wrapper.querySelector('.key');
    const valueEl = wrapper.querySelector('.value');
    if (!keyEl || !valueEl) { throw new Error('Could not locate key and/or value elements'); }

    const onSummit: SubmitFn = (key: string, newKey: string, newValue: string) => {
      console.log("Updated kvp", {key, newKey, newValue});
      this.repo.update(key, { key: newKey, value: newValue});
      keyEl.textContent = newKey;
      keyEl.classList.toggle(CSS_UPDATED, newKey != kvp.key);
      valueEl.textContent = newValue;
      valueEl.classList.toggle(CSS_UPDATED, newValue != kvp.value);

      //the full wrapper gets the 'updated' class if either the key or value elements have the class
      wrapper.classList.toggle(CSS_UPDATED, !wrapper.classList.contains(CSS_NEW) && (keyEl.classList.contains(CSS_UPDATED) || valueEl.classList.contains(CSS_UPDATED)));

      //save to disk
      this.save();
    };

    new KeyValuePairModal(this.app, kvp.key, kvp.value, onSummit)
      .open();
  }

  protected addNewEntry() {
    const onSummit: SubmitFn = (key: string, newKey: string, newValue: string) => {
      console.log("Added kvp", {key, newKey, newValue});
      this.repo.update('', { key: newKey, value: newValue});
      this.addKvpElement(newKey, newValue, true);

      //save to disk
      this.save();
    };

    new KeyValuePairModal(this.app, '', '', onSummit)
      .open();

  }
}