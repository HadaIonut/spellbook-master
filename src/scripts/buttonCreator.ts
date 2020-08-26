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

        if (type === "actor"){
            let button = $(`<a class="popout" style><i class="fas fa-book"></i>Export Spellbook</a>`);
            button.on('click', () => spellManager.spellExporter(actor.object));
            element.after(button);
        }
        if (type === "spell"){
            let button = $(`<a class="popout" style><i class="fas fa-book"></i>Learn Spell</a>`);
            button.on('click', () => spellManager.learnSpell(actor.object));
            element.after(button);
        }
    }

    public onRenderActorSheet(obj, html) {
        let element = html.find(".window-header .window-title")
        buttonCreator.addButton(element, obj, "actor");
    }

    public onRenderItemSheet(obj, html) {
        let element = html.find(".window-header .window-title")
        if (obj.object.data.type === "spell") buttonCreator.addButton(element, obj, "spell");
    }
}

export default buttonCreator.getInstance();