import { Plugin, WorkspaceLeaf } from "obsidian";
import FeaturesAbstract from "../features.abstract";
import { KvpView, VIEW_TYPE_KVP } from "./kvp-view";

export default class KvpEditor extends FeaturesAbstract {

  constructor(main: Plugin) {
    super(main);
  }

  onload(): void {
    this.main.registerView(
      VIEW_TYPE_KVP,
      (leaf: WorkspaceLeaf) => new KvpView(leaf)
    );
    this.main.registerExtensions(["kvp"], VIEW_TYPE_KVP);
  }

  onunload(): void {
    //nothing to do??
    
  }
}