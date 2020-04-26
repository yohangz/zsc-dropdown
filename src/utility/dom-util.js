
/**
 * Remoev all child nodes from a parent node.
 * Performant than setting innerHtml.
 * @param {HTMLElement} root Root element
 */
export function removeChildNodes(root) {
    while (root.firstChild) {
        root.removeChild(root.firstChild);
    }
}

/**
 * Create HTML element.
 * @param {HTMLDocument} doc HTML document reference.
 * @param {string} cssClasses CSS classes list seperated by spaces.
 * @param {string} type Node type name.
 * @returns {HTMLElement} Element refernece.
 */
export function createElement(doc, cssClasses, type = 'div') {
    const el = doc.createElement(type);
    if (cssClasses) {
        el.className = cssClasses
    }
    
    return el;
}

/**
 * Create dropdown option list item.
 * @param {HTMLDocument} doc HTMl Document refernece.
 * @param {string} key Option key.
 * @param {string} value Option value.
 * @param {string} className CSS class name.
 * @returns {HTMLElement} List element.
 */
export function createDropdownOption(doc, key, value, className) {
    const dropdownListOption = createElement(doc, className, 'li');
    dropdownListOption.dataset.key = key;
    dropdownListOption.textContent = value;
    dropdownListOption.setAttribute('title', value);
    return dropdownListOption;
}

/**
 * Create or reuse existing list element to render list options.
 * @param {HTMLDocument} doc HTMl Document refernece.
 * @param {HTMLElement} root Lits root element.
 * @param {number} index Child index.
 * @param {string} key Option key.
 * @param {string} value Option value.
 * @param {string} className CSS class name.
 * @returns {HTMLElement} List element.
 */
export function createOrUseDropdownOption(doc, root, index, key, value, className) {
    if (root.children.length > index) {
        let node = root.children[index];
        node.classList.remove(`${className}--hidden`);
        if (node.dataset.key == key) {
            return node;
        }

        node.dataset.key = key;
        node.textContent = value;
        node.setAttribute('title', value);
        return node;
    } else {
        const node = createDropdownOption(doc, key, value, className);
        root.appendChild(node);
        return node;
    }
}