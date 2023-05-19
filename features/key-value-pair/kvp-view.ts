import { TextFileView, WorkspaceLeaf } from "obsidian";
import { KeyValuePairRepo } from "./kvp-repo";

export const VIEW_TYPE_KVP = "kvp-view";

export class KvpView extends TextFileView {
  repo: KeyValuePairRepo;
  wrapper: HTMLElement;

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
    this.repo = new KeyValuePairRepo();
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

    //todo: need to maintain the filter

    const data = this.repo.get();

    Object.keys(data).forEach(key => {
        const kvp = this.wrapper.createEl('div');
        kvp.classList.add('kvp');
        const keyEl = kvp.createEl('div');
        keyEl.classList.add('key');
        keyEl.textContent = key;
        const valueEl = kvp.createEl('div');
        valueEl.classList.add('value');
        valueEl.textContent = data[key];
    })
  }
}