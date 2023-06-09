import { Plugin, WorkspaceLeaf } from "obsidian";
import FeaturesAbstract from "../features.abstract";
import { KvpView, VIEW_TYPE_KVP } from "./kvp-view";

export default class KvpEditor extends FeaturesAbstract {

  constructor(main: Plugin) {
    super(main);
  }

  async onload() {
    this.main.registerView(
      VIEW_TYPE_KVP,
      (leaf: WorkspaceLeaf) => new KvpView(leaf)
    );
    this.main.registerExtensions(["kvp"], VIEW_TYPE_KVP);
    const settings = await this.main.loadData()
    console.log("Got Settings in KvpEditor", settings);
  }

  onunload(): void {
    this.main.app.workspace.detachLeavesOfType(VIEW_TYPE_KVP); 
  }
}
