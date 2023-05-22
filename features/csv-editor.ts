import { Plugin, WorkspaceLeaf } from "obsidian";
import FeaturesAbstract from "./features.abstract";
import { CsvView, VIEW_TYPE_CSV } from "./csv-view";

export default class CsvEditor extends FeaturesAbstract {

  constructor(main: Plugin) {
    super(main);
  }

  onload(): void {
    this.main.registerView(
      VIEW_TYPE_CSV,
      (leaf: WorkspaceLeaf) => new CsvView(leaf)
    );
    this.main.registerExtensions(["csv"], VIEW_TYPE_CSV);
  }

  onunload(): void {
    this.main.app.workspace.detachLeavesOfType(VIEW_TYPE_CSV); 
  }
}