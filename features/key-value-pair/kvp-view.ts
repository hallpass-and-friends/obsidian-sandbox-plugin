import { KeymapEventHandler, MarkdownRenderer, TextFileView, WorkspaceLeaf } from "obsidian";
import { KeyValuePairRepo } from "./kvp-repo";
import { KeyValuePairModal, SubmitFn } from "./kvp-modal";
import { SingleKeyValuePair } from "./kvp.models";
import { Toolbar } from "./toolbar";
import { HtmlHelper, icons } from "lib";
//import { HushHushService } from "./hush-hush.service";

export const VIEW_TYPE_KVP = "kvp-view";

type RenderMode = 'text' | 'markdown';
type ViewMode = 'collapsed' | 'open';
const viewModes: ViewMode[] = ['collapsed', 'open'];

const CSS_UPDATED = "updated";
const CSS_NEW = "new";
export class KvpView extends TextFileView {
  repo: KeyValuePairRepo;
  wrapper: HTMLElement;
  toolbar: Toolbar;
  mode: RenderMode;

  protected _cache: {
    kvp: SingleKeyValuePair,
    row: HTMLElement
  }[] = [];

  protected keyEventHandler: KeymapEventHandler;

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
    this.repo = new KeyValuePairRepo();

    console.log("Vault Name", this.app.vault.getName());
    console.log("Vault Root", this.app.vault.getRoot());
  }

  async onOpen() {
    this.setRenderMode('text');
    this.setupToolbar();

    this.wrapper = this.contentEl.createEl("div");
    this.wrapper.classList.add('kvp-view');     
  }
  async onClose() {
    this.contentEl.empty();
    if (this.keyEventHandler) {
      this.app.scope.unregister(this.keyEventHandler);
    }
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

    this._cache = []; //reset

    Object.keys(data).forEach(key => {
      this._cache.push({
        kvp: {
          key,
          value: data[key]
        },
        row: this.addKvpElement(key, data[key])
      });
    });

  }

  protected addKvpElement(key: string, value: string, isNew?: boolean) {
    const kvpEl = HtmlHelper.createEl(this.wrapper, 'div', 'kvp');
    kvpEl.classList.toggle(CSS_NEW, isNew === true);
    
    //key
    const keyEl = HtmlHelper.createEl(kvpEl, 'div', 'key');
    keyEl.classList.add('key');
    const keyInnerEl = HtmlHelper.createEl(keyEl, 'div', 'inner');
    const keyLabelEl = HtmlHelper.createEl(keyInnerEl, 'span', 'label');
    keyLabelEl.textContent = key;
    const keyIconEl = HtmlHelper.createEl(keyInnerEl, 'span', 'icon');
    keyIconEl.innerHTML = icons.svg["caret-down-solid"];

    //value
    const valueEl = HtmlHelper.createEl(kvpEl, 'div', 'value');
    this.renderValue(valueEl, value);


    //--- events ---//

    //click key, toggle view
    keyEl.onclick = (ev) => {
      this.toggleRowViewMode(kvpEl);
    } 
    
    //--- default to collapsed state ---//
    this.updateRowViewMode(kvpEl, 'collapsed');

    return kvpEl;
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

  // --- Value Render Mode === //

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
      tint: 'none',
      onClick: (ev, btn) => {
        this._cache.forEach(c => {
          this.updateRowViewMode(c.row, 'open');
        });
      }
    })
    .addItem('center', {
      id: 'collapse-all',
      icon: 'caret-up-solid',
      title: 'collapse all items',
      tint: 'none',
      onClick: (ev, btn) => {
        this._cache.forEach(c => {
          this.updateRowViewMode(c.row, 'collapsed');
        });
      }
    })
    .addItem('right', {
      id: 'mode',
      label: modeText(this.mode),
      title: modeTip(this.mode),
      tint: 'purple',
      onClick: (ev, btn) => {
        this.setRenderMode(this.mode === 'text' ? 'markdown' : 'text', true);
        btn.textContent = modeText(this.mode);
        btn.title = modeTip(this.mode);
      }
    });
  }

  protected setRenderMode(mode: RenderMode, updateChildren?: boolean) {
    this.mode = mode;
    if (this.wrapper) {
      this.wrapper.classList.toggle('text', mode === 'text');
      this.wrapper.classList.toggle('markdown', mode === 'markdown');
    }
    if (updateChildren) {
      this._cache.forEach(item => {
        this.renderValue(item.row.querySelector('.value') as HTMLElement, item.kvp.value);
      });
    } 
  }


  // -- RowViewMode Methods -- //

  protected getRowViewMode(row: HTMLElement) {
    let mode: ViewMode | undefined = undefined;

    viewModes.forEach(m => {
      if (row.classList.contains(m)) {
        mode = m;
      }
    });

    return mode;
  }

  protected updateRowViewMode(row: HTMLElement, state: ViewMode) {
    viewModes.forEach(mode => {
      row.classList.toggle(mode, mode === state);
    });
  }

  protected toggleRowViewMode(row: HTMLElement) {
    const current = this.getRowViewMode(row);
    if (current) {
      //change to the next mode (in viewModes)
      this.updateRowViewMode(row, viewModes[(viewModes.indexOf(current) + 1) % viewModes.length])
    } else {
      this.updateRowViewMode(row, viewModes[0]); //default to the first
    }
  }



}