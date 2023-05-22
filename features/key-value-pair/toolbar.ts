import { HtmlHelper, IBtnComponentConfig } from "lib";
import { MenuGroup } from "./menu-group";

export interface IToolbarItem extends IBtnComponentConfig {
  id: string;
 }


export interface IZone {
  menu: MenuGroup<IToolbarItem>;
}

export type ZoneName = 'left' | 'center' | 'right';
export type Zones = { [key in ZoneName]: IZone };

export interface IZoneWithName extends IZone {
  name: ZoneName;
}

export class Toolbar {
  toolbarEl: HTMLElement;
  zones: Zones;
  protected get zonesList(): IZoneWithName[] {
    return Object.keys(this.zones).map((key) => {
      return {
        ...this.zones[key as ZoneName],
        name: key as ZoneName
      }
    });
  }
  protected get items() {
    return this.zonesList.reduce((ret, zone) => {
      return [
        ...ret,
        ...zone.menu.items
      ];
    }, []);
  }
  

  constructor(contentEl: HTMLElement) {
    this.initialize(contentEl);
  }

  private queryItem(id: string) {
    const item = this.items.find(x => x.id === id);
    const btn = this.toolbarEl.querySelector(`button[data-id="${id}"`) as (HTMLButtonElement | undefined);
    return { item, btn };
  }


  addItem(zoneName: ZoneName, item: IToolbarItem) {
    this.zones[zoneName].menu.addItem(item);
    return this;
  }

  //  toggle css value(s) 
  //  if no css is provided, then toggle disabled
  //  if force is provided, then disabled is set to that value
  toggle(item: string | IToolbarItem, css?: string | string[] | null, force?: boolean) {
    
    const zones = this.zonesList;
    let btn: HTMLButtonElement | null = null;
    for (let i = 0; i < zones.length && !btn; i++) {
      btn = zones[i].menu.toggle(item, css, force);      
    } 
      
    return btn;
  }


  protected initialize(contentEl: HTMLElement) {
    this.toolbarEl = HtmlHelper.createEl(contentEl, 'nav', 'kvp-toolbar');
    
    this.zones = {
      left: {
        menu: new MenuGroup(this.toolbarEl, ['zone', 'left'])
      },
      center: {
        menu: new MenuGroup(this.toolbarEl, ['zone', 'center'])
      },
      right: {
        menu: new MenuGroup(this.toolbarEl, ['zone', 'right'])
      },
    };
  }

}