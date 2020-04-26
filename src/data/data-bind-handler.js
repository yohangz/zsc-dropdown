import { DataTrie } from './data-trie.js';

/**
 * Static data bind event handler.
 * This handler can be used to bind data object collections to dropdown.
 * This handler build and cache a data trie for performant search filter functionality.
 * @param {object[]} data Data object collection.
 * @returns {function} Data bind callback function which accepts options object and return processed data.
 */
export function staticDataBindHandler(data) {
  if (!Array.isArray(data)) {
    throw new Error('Type of data must be an array.');
  }

  let trieCache = null;

  return ({ valuePropertyIdentifier, offset, limit, query }) => {
    // Build trie cache if not available.
    if (trieCache === null) {
      trieCache = new DataTrie();
      data.forEach((option, index) => {
        let optionValue = String(option[valuePropertyIdentifier]).toLocaleLowerCase();
        trieCache.addWord(optionValue, index);
      });
    }

    const trimmedQuery = String(query).toLocaleLowerCase().trim();
    let filterResult = data;

    // filter result set if nonempty query is present.
    if (trimmedQuery) {
      filterResult = trieCache.findWord(trimmedQuery).map((index) => {
        return data[index];
      });
    }

    return filterResult.slice(offset, offset + limit);
  };
}
