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
                entrySet.add(spell.labels.level);
                return entrySet;
            }
        }
    }

    private async _prepareDataForText(items: any) {
        const spellCompendiums = this._findSpellCompendium();
        const compendiumEntry = [];
        for (const item of items) {
            if (item.type !== "spell") continue;
            compendiumEntry.push([...await this._findSpellInCompendium(item, spellCompendiums)]);
        }
        compendiumEntry.sort((a, b) => {
            if (a[2] < b[2]) return -1;
            if (a[2] > b[2]) return 1;
            return 0
        });
        return compendiumEntry
    }

    private async _prepareSpellbookText(items: any): Promise<string> {
        let spellBookText = ``;
        const entries = await this._prepareDataForText(items);
        //spellBookText += `@Compendium[${compendiumEntry[1]}.${compendiumEntry[0]._id}]{${compendiumEntry[0].name}}`;
        //spellBookText += '<br>'
        return spellBookText;
    }

    public async spellExporter(actor) {
        const items = actor.data.items;

        const spellBookText = await this._prepareSpellbookText(items);

        const newItemName = `${actor.data.name}'s Spellbook`
        const newItemData = {
            name: newItemName,
            type: "loot",
            flags: "",
            img: "systems/dnd5e/icons/items/inventory/book-purple.jpg",
            data: {
                description: {value: spellBookText}
            }
        }
        if (spellBookText !== '') {
            await Item.create(newItemData, {renderSheet: true});
            ui.notifications.info("Spellbook has been created in the items tab");

        } else {
            ui.notifications.warn("No spells found");
        }
    }
}

export default spellManager.getInstance();