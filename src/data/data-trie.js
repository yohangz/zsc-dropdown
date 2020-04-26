/**
 * Dropdown data trie.
 * This data structure is used to optimize the options filter performance.
 */
export class DataTrie {
    constructor() {
        this.children = new Map();
        
        // Keep track of all options indexes (original data source) associated to a given trie node.
        // Node indexes used instead of actual option values to reduce memory usage.
        this.maches = [];
    }

    /**
     * Add word to trie.
     * @param {string} option Option value text.
     * @param {number} index Option index in original data source.
     */
    addWord(option, index) {
        let curr = this;

        for (let char of option) {
            if (curr.children.has(char)) {
                curr = curr.children.get(char);
            } else {
                const node = new DataTrie();
                curr.children.set(char, node);
                curr = node;
            }

            curr.maches.push(index);
        }
    }

    /**
     * Find word's maching results in trie.
     * @param {string} query Filter query.
     * @returns {number[]} Matching node index collection.
     */
    findWord(query) {
        let curr = this;

        for (let char of query) {
            if (!curr.children.has(char)) {
                return [];
            } 

            curr = curr.children.get(char);
        }

        return curr.maches;
    }
}
