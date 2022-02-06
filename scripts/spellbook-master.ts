import { warn } from './lib.js';
import { spellExporter } from './spellManager.js';

export const initHooks = () => {
  warn('Init Hooks processing');
};

export const setupHooks = async () => {
  //
};

export const readyHooks = async () => {
  //
  Hooks.on('renderActorSheet', onRenderActorSheet);
};

const addButton = (element, actor, type) => {
  if (element.length != 1) return;

  const button = $(`<a class="popout" style><i class="fas fa-book"></i>Export Spellbook</a>`);
  button.on('click', () => spellExporter(actor.object));
  element.after(button);
};

const onRenderActorSheet = (obj, html) => {
  const element = html.find('.window-header .window-title');
  addButton(element, obj, 'actor');
};
