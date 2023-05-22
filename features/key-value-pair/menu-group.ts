import { IBtnComponentConfig } from "lib";
import { MenuGroupAbstract } from "./menu-group.abstract";


export class MenuGroup<IBtn extends IBtnComponentConfig> extends MenuGroupAbstract<IBtn> {

  constructor(contentEl?: HTMLElement, css?: string | string[]) {
    super(contentEl, css);
  }

}

