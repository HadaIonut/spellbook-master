import CONSTANTS from './constants';
import { i18n } from './lib';

export const registerSettings = function (): void {
  game.settings.register(CONSTANTS.MODULE_NAME, 'restrictOnlyGM', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.setting.restrictOnlyGM.title`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.restrictOnlyGM.hint`),
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
  });
  game.settings.register(CONSTANTS.MODULE_NAME, 'removeLabelSheetHeader', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.setting.removeLabelSheetHeader.title`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.setting.removeLabelSheetHeader.hint`),
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
  });
};
