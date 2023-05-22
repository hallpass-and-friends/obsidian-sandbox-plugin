import { IconName, icons } from "./icons";

export type BtnSize = 'small' | 'normal' | 'large';
export type BtnTint = 'none' | 'cyan' | 'blue' | 'green' | 'yellow' | 'orange' | 'red' | 'purple';

export interface IBtnComponentConfig {
  label?: string;  
  icon?: IconName;
  title?: string;
  size?: BtnSize;
  tint?: BtnTint;
  css?: string | string[];
  disabled?: boolean;
  data?: {[key: string]: string}
}
export const DEFAULT_BTN_CONFIG: IBtnComponentConfig = {
  size: 'normal',
  tint: 'none',
};

export class BtnComponent {

  static appendTo(parent: HTMLElement, config: IBtnComponentConfig) {
    config = {
      ...DEFAULT_BTN_CONFIG,
      ...config
    };


    const btn = parent.createEl('button', {cls: `btn`});
    btn.classList.add(`btn-${config.size}`);
    btn.classList.add(`btn-${config.tint}`);
    btn.title = config.title || '';
    btn.disabled = config.disabled === true;

    //any additional css
    const css = this.toNullableStringArray(config.css);
    if (css) {
      css.forEach(c => btn.classList.add(c));
    }

    //add any data
    if (config.data) {
      const data = config.data || {}; 
      Object.keys(data)
        .forEach(key => btn.dataset[key] = data[key]);
    }

    const html: string[] = [];
    if (config.icon) {
      html.push(`<span class="icon${config.label ? ' rm' : ''}">${icons.svg[config.icon]}</span>`);
    }
    if (config.label) {
      html.push(`<span class="label">${config.label}</span>`);
    }

    btn.innerHTML = html.join('');

    return btn;
  }

  private static toNullableStringArray(value?: string | string[] | null) {
    return typeof(value) === 'string' ? [value]
      : (Array.isArray(value) ? value : null);
  }

}