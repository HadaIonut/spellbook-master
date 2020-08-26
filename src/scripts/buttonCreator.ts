import spellManager from "./spellManager";

class buttonCreator{
    private static _instance: buttonCreator;

    private constructor() {
    }

    public static getInstance(): buttonCreator {
        if (!buttonCreator._instance) buttonCreator._instance = new buttonCreator();
        return buttonCreator._instance;
    }

    static addButton(element, actor, type) {
        if (element.length != 1) return;

        let button = $(`<a class="popout" style><i class="fas fa-book"></i>Export Spellbook</a>`);
        button.on('click', () => spellManager.spellExporter(actor.object));

        element.after(button);
    }

    public onRenderActorSheet(obj, html) {
        let element = html.find(".window-header .window-title")
        buttonCreator.addButton(element, obj, "actor");
    }
}

export default buttonCreator.getInstance();