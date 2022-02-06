import {spellExporter} from "./spellManager.js";

const addButton = (element, actor, type) => {
    if (element.length != 1) return;

    let button = $(`<a class="popout" style><i class="fas fa-book"></i>Export Spellbook</a>`);
    button.on('click', () => spellExporter(actor.object));
    element.after(button);
}

const onRenderActorSheet = (obj, html) => {
    let element = html.find(".window-header .window-title")
    addButton(element, obj, "actor");
}

Hooks.on('renderActorSheet', onRenderActorSheet);
