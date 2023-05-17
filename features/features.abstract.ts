import { Plugin } from "obsidian";

export default abstract class FeaturesAbstract {
  main: Plugin;

  constructor(main: Plugin) {
    this.main = main;
  }

  //must implement
  abstract onload(): void;
  abstract onunload(): void;
}