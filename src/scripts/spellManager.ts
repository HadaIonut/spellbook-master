class spellManager {
    private static _instance: spellManager;

    private constructor() {
    }

    public static getInstance(): spellManager {
        if (!spellManager._instance) spellManager._instance = new spellManager();
        return spellManager._instance;
    }

    private _findSpellCompendium(): Set<any> {
        const availableCompendiums = game.packs.keys();
        const spellCompendiums = new Set();
        for (const key of availableCompendiums) {
            if (key.includes("spells")) spellCompendiums.add(key);
        }
        return spellCompendiums;
    }

    private async _findSpellInCompendium(spell: any, compendiums: Set<any>): Promise<Set<any>> {
        const entrySet = new Set();
        for (const key of compendiums) {
            const pack = game.packs.get(key);
            await pack.getIndex();
            const entry = pack.index.find(e => e.name === spell.name);
            if (entry) {
                entrySet.add(entry);
                entrySet.add(key);
                return entrySet;
            }
        }
    }

    public async spellExporter(actor) {
        let spellBookText = ``;
        const spellCompendiums = this._findSpellCompendium();
        const items = actor.data.items;

        for (const item of items) {
            if (item.type !== "spell") continue;
            const compendiumEntry = [...await this._findSpellInCompendium(item, spellCompendiums)];
            spellBookText += `@Compendium[${compendiumEntry[1]}.${compendiumEntry[0]._id}]{${compendiumEntry[0].name}}`;
        }

        const newItemName = `${actor.data.name}'s Spellbook`
        const newItemData = {
            name: newItemName,
            type: "loot",
            flags: "",
            img: "systems/dnd5e/icons/items/inventory/book-purple.jpg",
            data:{
                description: { value: spellBookText }
            }
        }
        await Item.create(newItemData);
    }
}

export default spellManager.getInstance();