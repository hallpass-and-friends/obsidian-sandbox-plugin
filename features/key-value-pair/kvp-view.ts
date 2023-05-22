import { MarkdownRenderer, TextFileView, WorkspaceLeaf } from "obsidian";
import { KeyValuePairRepo } from "./kvp-repo";
import { KeyValuePairModal, SubmitFn } from "./kvp-modal";
import { SingleKeyValuePair } from "./kvp.models";
import { Toolbar } from "./toolbar";
//import { HushHushService } from "./hush-hush.service";

export const VIEW_TYPE_KVP = "kvp-view";

type RenderMode = 'text' | 'markdown';

const CSS_UPDATED = "updated";
const CSS_NEW = "new";
export class KvpView extends TextFileView {
  repo: KeyValuePairRepo;
  wrapper: HTMLElement;
  toolbar: Toolbar;
  mode: RenderMode;

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
    this.setMode('text');
    this.setupToolbar();

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

  }

  protected addKvpElement(key: string, value: string, isNew?: boolean) {
    const kvpEl = this.wrapper.createEl('div');
    kvpEl.classList.add('kvp');
    kvpEl.classList.toggle(CSS_NEW, isNew === true);
    
    const keyEl = kvpEl.createEl('div');
    keyEl.classList.add('key');
    keyEl.textContent = key;

    const valueEl = kvpEl.createEl('div');
    valueEl.classList.add('value');
    this.renderValue(valueEl, value);

    //click anywhere, get the editor
    kvpEl.onclick = (ev) => {
      this.edit({key, value: value}, kvpEl);
    }    
  }

  protected edit(kvp: SingleKeyValuePair, wrapper: HTMLDivElement) {

    const keyEl: HTMLElement =  wrapper.querySelector('.key') as HTMLElement;
    const valueEl: HTMLElement = wrapper.querySelector('.value') as HTMLElement;
    if (!keyEl || !valueEl) { throw new Error('Could not locate key and/or value elements'); }

    const onSummit: SubmitFn = (key: string, newKey: string, newValue: string) => {
      console.log("Updated kvp", {key, newKey, newValue});
      this.repo.update(key, { key: newKey, value: newValue});
      keyEl.textContent = newKey;
      keyEl.classList.toggle(CSS_UPDATED, newKey != kvp.key);

      valueEl.classList.toggle(CSS_UPDATED, newValue != kvp.value);
      this.renderValue(valueEl, newValue);

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

  protected renderValue(el: HTMLElement, value: string) {
    el.empty(); //reset
    switch (this.mode) {
      case 'markdown':
        MarkdownRenderer.renderMarkdown(value, el, this.app.workspace.getActiveFile()?.path || '', this.leaf.view);
        break;
      case 'text':
        el.textContent = value;
        break;
      default:
        throw new Error(`KvpView does not support a render mode of ${this.mode}`);
    }
    return el;
  }

  protected setupToolbar() {
    this.toolbar = new Toolbar(this.contentEl);

    const modeText = (mode: RenderMode) => mode === 'text' ? '= TEXT' : '# HTML';
    const modeTip = (mode: RenderMode) => mode === 'text' ? 'click to render as HTML' : 'click to show as text';


    this.toolbar.addItem('left', {
      id: 'add',
      icon: 'plus',
      label: 'NEW',
      title: 'Add new key-value pair',
      tint: 'cyan',
      onClick: (ev, btn) => {
        this.addNewEntry();
      }
    })
    .addItem('center', {
      id: 'expand-all',
      icon: 'caret-down-solid',
      title: 'expand all items',
      tint: 'orange',
      onClick: (ev, btn) => {
        console.log("EXPAND ALL")
      }
    })
    .addItem('center', {
      id: 'collapse-all',
      icon: 'caret-up-solid',
      title: 'collapse all items',
      tint: 'orange',
      onClick: (ev, btn) => {
        console.log("COLLAPSE ALL")
      }
    })
    .addItem('right', {
      id: 'mode',
      label: modeText(this.mode),
      title: modeTip(this.mode),
      tint: 'purple',
      onClick: (ev, btn) => {
        this.setMode(this.mode === 'text' ? 'markdown' : 'text', true);
        btn.textContent = modeText(this.mode);
        btn.title = modeTip(this.mode);
      }
    });
  }

  protected setMode(mode: RenderMode, updateChildren?: boolean) {
    this.mode = mode;
    if (this.wrapper) {
      this.wrapper.classList.toggle('text', mode === 'text');
      this.wrapper.classList.toggle('markdown', mode === 'markdown');
    }
    if (updateChildren) {
      this.refresh();
    } 
  }


}