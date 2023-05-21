
export interface IToolbarItem {
  id: string;
  label: string;
  tip?: string;
  css?: string | string[];
  disabled?: boolean;
  onClick: (ev: MouseEvent, btn: HTMLButtonElement) => void;
}


export interface IZone {
  zoneEl: HTMLElement;
  items: IToolbarItem[];
}

export type ZoneName = 'left' | 'center' | 'right';
export type Zones = { [key in ZoneName]: IZone };

export class Toolbar {
  toolbarEl: HTMLElement;
  zones: Zones;
  protected get items() {
    return Object.keys(this.zones).reduce((ret, key) => {
      return [
        ...ret,
        ...this.zones[key as ZoneName].items
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
    this.createNavBtn(this.zones[zoneName], item);
    return this;
  }

  //  toggle css value(s) 
  //  if no css is provided, then toggle disabled
  //  if force is provided, then disabled is set to that value
  toggle(item: string | IToolbarItem, css?: string | string[] | null, force?: boolean) {
    const id = typeof(item) === 'string' ? item : item?.id;
    if (!id) {
      throw new Error(`Toolbar.toggle() - missing id param`);
    }

    const { btn } = this.queryItem(id);
    if (!btn) { 
      throw new Error(`Toolbar.toggle() - could not locate btn with id: ${id}`);
    }

    css = this.toNullableStringArray(css);
    if (css) {
      css.forEach(c => btn.classList.toggle(c, force === true));
    } else {
      // toggle disabled
      btn.disabled = typeof(force) === 'boolean' ? force : !btn.disabled;
    }

    return btn;
  }


  protected initialize(contentEl: HTMLElement) {
    this.toolbarEl = this.createEl(contentEl, 'nav', 'kvp-toolbar');
    this.zones = {
      left: {
        zoneEl: this.createEl(this.toolbarEl, 'span', ['zone', 'left']),
        items: []
      },
      center: {
        zoneEl: this.createEl(this.toolbarEl, 'span', ['zone', 'center']),
        items: []
      },
      right: {
        zoneEl: this.createEl(this.toolbarEl, 'span', ['zone', 'right']),
        items: []
      },
    };
  }

  private createNavBtn(zone: IZone, item: IToolbarItem) {
    const btn = this.createEl(zone.zoneEl, 'button', item.css) as HTMLButtonElement;
    btn.dataset.id = item.id;
    btn.textContent = item.label;
    btn.disabled = item.disabled === true;
    btn.onclick = ((ev) => item.onClick(ev, btn));
    if (item.tip) {
      btn.title = item.tip;
    }
    return btn;
  }

  private createEl(parentEl: HTMLElement, tag: keyof HTMLElementTagNameMap, css?: string | string[] | null) {
    const el = parentEl.createEl(tag);
    
    //add any classes
    css = this.toNullableStringArray(css);
    if (css) {
      css.forEach(c => el.classList.add(c));
    }

    return el;
  }


  private toNullableStringArray(value?: string | string[] | null) {
    return typeof(value) === 'string' ? [value]
      : (Array.isArray(value) ? value : null);
  }
}