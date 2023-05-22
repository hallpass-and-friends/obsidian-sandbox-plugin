export type IconName = 'plus' | 'caret-down' | 'caret-up' | 'caret-down-solid' | 'caret-up-solid' | 'edit';

export type IconSet = { [key in IconName]: string };

export type IconDictionary = {
  names: IconName[],
  svg: IconSet  
}

const svg: IconSet = {
  plus: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M240 64c0-8.8-7.2-16-16-16s-16 7.2-16 16V240H32c-8.8 0-16 7.2-16 16s7.2 16 16 16H208V448c0 8.8 7.2 16 16 16s16-7.2 16-16V272H416c8.8 0 16-7.2 16-16s-7.2-16-16-16H240V64z"/></svg>`,
  "caret-down": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M165.6 349.8c-1.4 1.3-3.5 2.2-5.6 2.2s-4.2-.8-5.6-2.2L34.2 236.3c-1.4-1.3-2.2-3.2-2.2-5.2c0-3.9 3.2-7.1 7.1-7.1l241.7 0c3.9 0 7.1 3.2 7.1 7.1c0 2-.8 3.8-2.2 5.2L165.6 349.8zm22 23.3L307.7 259.6c7.8-7.4 12.3-17.7 12.3-28.4c0-21.6-17.5-39.1-39.1-39.1L39.1 192C17.5 192 0 209.5 0 231.1c0 10.8 4.4 21.1 12.3 28.4L132.4 373.1c7.4 7 17.3 10.9 27.6 10.9s20.1-3.9 27.6-10.9z"/></svg>`,
  "caret-up": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M154.4 162.2c1.4-1.3 3.5-2.2 5.6-2.2s4.2 .8 5.6 2.2L285.8 275.7c1.4 1.3 2.2 3.2 2.2 5.2c0 3.9-3.2 7.1-7.1 7.1H39.1c-3.9 0-7.1-3.2-7.1-7.1c0-2 .8-3.8 2.2-5.2L154.4 162.2zm-22-23.3L12.3 252.4C4.4 259.8 0 270.1 0 280.9C0 302.5 17.5 320 39.1 320H280.9c21.6 0 39.1-17.5 39.1-39.1c0-10.8-4.4-21.1-12.3-28.4L187.6 138.9c-7.4-7-17.3-10.9-27.6-10.9s-20.1 3.9-27.6 10.9z"/></svg>`,
  "caret-down-solid": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"/></svg>`,
  "caret-up-solid": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M182.6 137.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z"/></svg>`,
  "edit": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M64 96H512c17.7 0 32 14.3 32 32v69.6c10.2-4 21.1-5.9 32-5.6V128c0-35.3-28.7-64-64-64H64C28.7 64 0 92.7 0 128V384c0 35.3 28.7 64 64 64H330.2l8-32H64c-17.7 0-32-14.3-32-32V128c0-17.7 14.3-32 32-32zm48 192c-8.8 0-16 7.2-16 16s7.2 16 16 16H368c8.8 0 16-7.2 16-16s-7.2-16-16-16H112zM96 208c0 8.8 7.2 16 16 16H464c8.8 0 16-7.2 16-16s-7.2-16-16-16H112c-8.8 0-16 7.2-16 16zm486.8 56l17.4 17.4c6.2 6.2 6.2 16.4 0 22.6l-24.8 24.8-40-40L560.2 264c6.2-6.2 16.4-6.2 22.6 0zM406.5 417.7L512.7 311.5l40 40L446.4 457.7c-2.1 2.1-4.6 3.5-7.4 4.2l-49 12.3 12.3-49c.7-2.8 2.2-5.4 4.2-7.4zM537.5 241.4L383.8 395.1c-6.2 6.2-10.5 13.9-12.6 22.3l-18.7 74.9c-1.4 5.5 .2 11.2 4.2 15.2s9.7 5.6 15.2 4.2L446.8 493c8.4-2.1 16.1-6.5 22.3-12.6L622.8 326.6c18.7-18.7 18.7-49.1 0-67.9l-17.4-17.4c-18.7-18.7-49.1-18.7-67.9 0z"/></svg>`,
} 

export const icons: IconDictionary = {
  names: Object.keys(svg).map(s => s as IconName),
  svg
}

