import CONSTANTS from './constants';
import { i18n } from './lib';

export const game = getGame();
export const canvas = getCanvas();

/**
 * Because typescript doesn't know when in the lifecycle of foundry your code runs, we have to assume that the
 * canvas is potentially not yet initialized, so it's typed as declare let canvas: Canvas | {ready: false}.
 * That's why you get errors when you try to access properties on canvas other than ready.
 * In order to get around that, you need to type guard canvas.
 * Also be aware that this will become even more important in 0.8.x because no canvas mode is being introduced there.
 * So you will need to deal with the fact that there might not be an initialized canvas at any point in time.
 * @returns
 */
function getCanvas(): Canvas {
  if (!(canvas instanceof Canvas) || !canvas.ready) {
    throw new Error('Canvas Is Not Initialized');
  }
  return canvas;
}

/**
 * Because typescript doesn't know when in the lifecycle of foundry your code runs, we have to assume that the
 * canvas is potentially not yet initialized, so it's typed as declare let canvas: Canvas | {ready: false}.
 * That's why you get errors when you try to access properties on canvas other than ready.
 * In order to get around that, you need to type guard canvas.
 * Also be aware that this will become even more important in 0.8.x because no canvas mode is being introduced there.
 * So you will need to deal with the fact that there might not be an initialized canvas at any point in time.
 * @returns
 */
function getGame(): Game {
  if (!(game instanceof Game)) {
    throw new Error('Game Is Not Initialized');
  }
  return game;
}

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
