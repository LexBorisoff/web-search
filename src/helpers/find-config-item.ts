import type { WithAlias } from '@app-types/config.types.js';

interface List<Item> {
  [key: string]: Item;
}

function withAlias<Item>(item: Item): item is Item & Required<WithAlias> {
  return item instanceof Object && 'alias' in item;
}

/**
 * Returns a tuple with the item's config key and the Item object
 * found in the config by provided name or alias. Otherwise returns undefined
 */
export function findConfigItem<Item>(
  nameOrAlias: string,
  list: List<Item>,
): [string, Item] | undefined {
  return Object.entries(list).find(([key, item]) => {
    // name is list's key
    if (nameOrAlias === key) {
      return true;
    }

    // item does not have aliases
    if (!withAlias(item)) {
      return false;
    }

    // name is item's alias
    const { alias } = item;
    return (
      (Array.isArray(alias) && alias.includes(nameOrAlias)) ||
      (typeof alias === 'string' && alias === nameOrAlias)
    );
  });
}
