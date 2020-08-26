import buttonCreator from "./buttonCreator"

Hooks.on('renderActorSheet', buttonCreator.onRenderActorSheet);

Hooks.on('renderItemSheet', (item) => {
    console.log(item)
});