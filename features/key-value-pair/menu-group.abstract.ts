import { BtnComponent, HtmlHelper, IBtnComponentConfig } from "lib";


export abstract class MenuGroupAbstract<IBtn extends IBtnComponentConfig> {
  containerEl: HTMLElement;
  protected _items: IBtn[];
  get items() {
    return [...this._items];
  }

  constructor(contentEl?: HTMLElement, css?: string | string[]) {
    if (contentEl) {
      this.initialize(contentEl, css);
    }
  }

  private queryItem(id: string) {
    const item = this._items.find(x => x.id === id);
    const btn = this.containerEl.querySelector(`button[data-id="${id}"`) as (HTMLButtonElement | undefined);
    return { item, btn };
  }

  addItem(item: IBtn): MenuGroupAbstract<IBtn> {
    this.createNavBtn(item, this.containerEl);
    return this;
  }

  //  toggle css value(s) 
  //  if no css is provided, then toggle disabled
  //  if force is provided, then disabled is set to that value
  toggle(item: string | IBtn, css?: string | string[] | null, force?: boolean) {
    const id = typeof(item) === 'string' ? item : item?.id;
    if (!id) {
      throw new Error(`Toolbar.toggle() - missing id param`);
    }

    const { btn } = this.queryItem(id);
    if (!btn) { 
      throw new Error(`Toolbar.toggle() - could not locate btn with id: ${id}`);
    }

    css = HtmlHelper.toNullableStringArray(css);
    if (css) {
      css.forEach(c => btn.classList.toggle(c, force === true));
    } else {
      // toggle disabled
      btn.disabled = typeof(force) === 'boolean' ? force : !btn.disabled;
    }

    return btn;
  }

  initialize(contentEl: HTMLElement, css?: string | string[]) {
    //reset if needed
    if (this.containerEl) {
      this.containerEl.empty();
    }

    css = [
      ...HtmlHelper.toNullableStringArray(css) || [],
      'menu-group'
    ];
    this.containerEl = HtmlHelper.createEl(contentEl, 'nav', css);
  }

  protected createNavBtn(item: IBtn, parentEl: HTMLElement) {
    const btn = BtnComponent.appendTo(parentEl, item);
    return btn;
  }



}

