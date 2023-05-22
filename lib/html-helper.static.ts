export class HtmlHelper {

  static createEl(parentEl: HTMLElement, tag: keyof HTMLElementTagNameMap, css?: string | string[] | null) {
    const el = parentEl.createEl(tag);
    
    //add any classes
    css = this.toNullableStringArray(css);
    if (css) {
      css.forEach(c => el.classList.add(c));
    }

    return el;
  }


  static toNullableStringArray(value?: string | string[] | null) {
    return typeof(value) === 'string' ? [value]
      : (Array.isArray(value) ? value : null);
  }

}