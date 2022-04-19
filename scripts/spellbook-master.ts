import { i18n, warn } from './lib.js';
import { spellExporter } from './spellManager.js';
import CONSTANTS from './constants.js';

export const initHooks = () => {
  warn('Init Hooks processing');
};

export const setupHooks = async () => {
  //
};

export const readyHooks = async () => {
  //
  //   Hooks.on('renderActorSheet', onRenderActorSheet);

  Hooks.on('getActorSheetHeaderButtons', (app, buttons) => {
    const removeLabelSheetHeader = game.settings.get(CONSTANTS.MODULE_NAME, 'removeLabelSheetHeader');
    const restrictedOnlyGM = game.settings.get(CONSTANTS.MODULE_NAME, 'restrictOnlyGM');
    if (restrictedOnlyGM && !game.user?.isGM) {
      return;
    }

    buttons.unshift({
      icon: 'fas fa-book',
      class: 'open-spellbook-master',
      label: removeLabelSheetHeader ? '' : i18n(`${CONSTANTS.MODULE_NAME}.actorSheetBtn`),
      onclick: function openPM(event) {
        const actor = app.object;
        spellExporter(actor);
      },
    });
  });
};

// const addButton = (element, actor, type) => {
//   if (element.length != 1) return;

//   const button = $(`<a class="popout" style><i class="fas fa-book"></i>Export Spellbook</a>`);
//   button.on('click', () => spellExporter(actor.object));
//   element.after(button);
// };

// const onRenderActorSheet = (obj, html) => {
//   const element = html.find('.window-header .window-title');
//   addButton(element, obj, 'actor');
// };
