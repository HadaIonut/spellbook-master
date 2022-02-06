/**
 * Returns all the compendiums that have spells in the name
 *
 * @private
 */
const _findSpellCompendium = () => {
    const availableCompendiums = game.packs.keys();
    const spellCompendiums = new Set();
    for (const key of availableCompendiums) {
        if (key.includes("spells")) spellCompendiums.add(key);
    }
    return spellCompendiums;
}

/**
 * Searches for a given spell in all compendiums that are given as parameters
 * Returns an object with the following fields: entry, key, level
 *
 * @param spell - a spell that has to be searched
 * @param compendiums - a set of all the compendiums
 * @private
 */
const _findSpellInCompendium = async (spell, compendiums) => {
    const entrySet = {};
    for (const key of compendiums) {
        const pack = game.packs.get(key);
        await pack.getIndex();
        const entry = pack.index.find(e => e.name === spell.name);
        if (entry) {
            entrySet['entry'] = entry;
            entrySet['key'] = key;
            entrySet['level'] = spell.data.data.level;
            return entrySet;
        }
    }
    ui.notifications.warn(`The spell '${spell.name}' has not been found.`);
}


/**
 * Returns the spells an object that contains all the items spells sorted by their level
 *
 * @param items - the items structure from the actor
 * @private
 */
const _prepareDataForText = async (items) => {
    const spellCompendiums = _findSpellCompendium();
    const compendiumEntry = {};
    for (const item of items) {
        if (item.type !== 'spell') continue;
        const spell = await _findSpellInCompendium(item, spellCompendiums);
        if (!spell) continue;
        const spellLevel = spell['level'];
        if (compendiumEntry[spellLevel]) compendiumEntry[spellLevel].push(spell);
        else {
            compendiumEntry[spellLevel] = [];
            compendiumEntry[spellLevel].push(spell)
        }
    }
    return compendiumEntry
}

/**
 * Returns the text that should be given to the spellbook by adding the spells into the html
 *
 * @param items - the items structure from the actor
 * @private
 */
const _prepareSpellbookText = async (items) => {
    let spellBookText = '';
    const entries = await _prepareDataForText(items);
    for (const entry in entries) {
        spellBookText += `<div align="center"> <b align="center">${entry}: </b> `;
        entries[entry].forEach((spell) => {
            spellBookText += `<p align="center"> @Compendium[${spell['key']}.${spell['entry']._id}]{${spell['entry'].name}} </p> `;
        })
        spellBookText += `</div>`;
    }

    return spellBookText;
}

/**
 * Creates a new item that contains all the spells of the target actor
 * In case the actor is not a spellcaster it will show a warning and will not create the item
 *
 * @param actor - the actor that provides the spells for the spellbook
 */
const spellExporter = async (actor) => {
    const items = actor.data.items;

    const spellBookText = await _prepareSpellbookText(items);

    const newItemName = `${actor.data.name}'s Spellbook`
    const newItemData = {
        name: newItemName,
        type: "loot",
        flags: {},
        folder: null,
        img: "systems/dnd5e/icons/items/inventory/book-purple.jpg",
        data: {
            description: {value: spellBookText},
            weight: 3,
            price: 50
        }
    }
    if (spellBookText !== '') {
        await Item.create(newItemData, {renderSheet: true});
        ui.notifications.info('Spellbook has been created in the items tab');

    } else {
        ui.notifications.warn('No spells found');
    }
}

export {spellExporter}
