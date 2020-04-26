import { createElement, createOrUseDropdownOption } from '../utility/dom-util.js';
import { debounce } from '../utility/event-util.js';

import { 
    DROPDOWN_LIST_ROOT,
    DROPDOWN_LIST_SEARCH_CONTAINER,
    DROPDOWN_LIST_SEARCH_ICON,
    DROPDOWN_LIST_SEARCH_TEXT,
    DROPDOWN_LIST_CONTAINER,
    DROPDOWN_LIST_OPTIONS,
    DROPDOWN_LIST_OPTION,
    DROPDOWN_LIST_NO_DATA_OPTION,
    DROPDOWN_LIST_NO_DATA_OPTION_VISIBLE,
    DROPDOWN_LIST_OPTION_SELECTED,
    DROPDOWN_LIST_OPTION_HIDDEN,
    DROPDOWN_LIST_HIDDEN
} from '../config/local-config.js';

/**
 * Dropdown options list component. This component render the dropdown options list menu.
 */
export class DropdownList {

    /**
     * Factory method to create an instance of DropdownList.
     * This will allow us to easily mock the usages in unit test specs.
     * @param {BasaeConfig} config Dropdown base configuration object.
     * @return {DropdownList} Dropdown list instance.
     */
    static createInstance(config) {
        return new DropdownList(config);
    }
    /**
     * Dropdown list constructor.
     * @param {BasaeConfig} config Dropdown base configuration object.
     */
    constructor(config) {
        this.config = config;
        
        this.dropdownListOptionClickEventHandler = this.dropdownListOptionClickEventHandler.bind(this);
    }

    /**
     * Dropdown list option click event handler.
     * This handler trigger option select change and selection change events while updating self selected state.
     */
    dropdownListOptionClickEventHandler(event) {
        const listOption = event.target;
        const key = listOption.dataset.key;
        const value = listOption.textContent;

        let selected = false;
        if (this.config.selected.has(key)) {
            this.config.selected.delete(key);
            listOption.classList.remove(DROPDOWN_LIST_OPTION_SELECTED);
            selected = false;
        } else {
            this.config.selected.set(key, value);
            listOption.classList.add(DROPDOWN_LIST_OPTION_SELECTED);
            selected = true;
        }

        this.config.onOptionSelectionChange.forEach((handler) => {
            handler({ key, value, selected });
        });

        this.config.onSelectionChange.forEach((handler) => {
            handler(this.config.selected);
        });
    }

    /**
     * Render dropdown list component asssociated markup.
     * @param {object[]} data Options data object collection.
     * @return {HTMLDivElement} Dropdown list view root element.
     */
    render(data) {
        const doc = this.config.document;
        
        // Create dropdown list root element.
        const dropdownList = createElement(doc, DROPDOWN_LIST_ROOT);
        dropdownList.style.width = this.config.optionsMenuWidth;
        dropdownList.style.height = this.config.optionsMenuHeight;

        // Create dropdown list search text box container.
        const dropdownListSearchContainer = createElement(doc, DROPDOWN_LIST_SEARCH_CONTAINER);
        dropdownList.appendChild(dropdownListSearchContainer);

        // Create dropdown search textbox icon.
        const dropdownListSearchIcon = createElement(doc, DROPDOWN_LIST_SEARCH_ICON, 'span');
        dropdownListSearchContainer.appendChild(dropdownListSearchIcon);

        // Create dropdown search textbox box.
        const dropdownListSearch = createElement(doc, DROPDOWN_LIST_SEARCH_TEXT, 'input');
        dropdownListSearch.type = 'text';
        dropdownListSearchContainer.appendChild(dropdownListSearch);
        
        // Create dropdown list options scrollable container.
        const dropdownListContainer = createElement(doc, DROPDOWN_LIST_CONTAINER);
        dropdownList.appendChild(dropdownListContainer);

        // Create dropdown list options root.
        const dropdownListOptions = createElement(doc, DROPDOWN_LIST_OPTIONS, 'ul');
        dropdownListContainer.appendChild(dropdownListOptions);

        // Create and no options available message element as the first list option.
        const dropdownListNoDataOption = createElement(doc, DROPDOWN_LIST_NO_DATA_OPTION, 'li');
        dropdownListNoDataOption.textContent = this.config.noDataMessage;
        dropdownListNoDataOption.setAttribute('title', this.config.noDataMessage);
        dropdownListOptions.appendChild(dropdownListNoDataOption);

        dropdownListOptions.addEventListener('click', this.dropdownListOptionClickEventHandler, false);

        // Construct debounced filter event handler which triggers options filter event.
        // This event handler is debounced to avoid running costly operation of filtering
        // the dropdown list options on each key stroke.
        this.filterEventHandler = debounce(() => {
            this.config.onOptionsFilter.forEach((handler) => {
                handler(dropdownListSearch.value);
            });
        }, this.config.filterDebounceDelay);

        dropdownListSearch.addEventListener('keyup', this.filterEventHandler, false);

        this.dropdownListElement = dropdownList;
        this.dropdownListSearch = dropdownListSearch;
        this.dropdownListOptions = dropdownListOptions;
        this.dropdownListNoDataOption = dropdownListNoDataOption;

        this.dataBind(data);

        return dropdownList;
    }

    /**
     * Construct dropdown list options associated with external data.
     * This method reuses the already created DOM elements on data rebind as a performance optimization.
     * @param {object[]} data Options data object collection.
     */
    dataBind(data) {
        if (!Array.isArray(data)) {
            throw new Error('Data bind failure. Malformed malformed.');
        }

        const doc = this.config.document;

        // Display no data message data collection is empty.
        if (!data.length) {
            this.dropdownListNoDataOption.classList.add(DROPDOWN_LIST_NO_DATA_OPTION_VISIBLE);
        } else {
            this.dropdownListNoDataOption.classList.remove(DROPDOWN_LIST_NO_DATA_OPTION_VISIBLE);
        }

        // Create or reuse dropdown list options.
        data.forEach((option, index) => {
            const key = option[this.config.keyPorpertyIndetifier];
            const value = option[this.config.valuePropertyIdentifier];

            // Start from index + 1 to skip the no data message list item.
            const node = createOrUseDropdownOption(doc, this.dropdownListOptions, index + 1, key, value, DROPDOWN_LIST_OPTION);

            if (this.config.selected.has(String(key))) {
                node.classList.add(DROPDOWN_LIST_OPTION_SELECTED);
            } else {
                node.classList.remove(DROPDOWN_LIST_OPTION_SELECTED);
            }
        });

        // Hide additional dropdown list options on future data bind invocations.
        for (let i = data.length + 1; i < this.dropdownListOptions.children.length; i++) {
            const node = this.dropdownListOptions.children[i];
            node.classList.add(DROPDOWN_LIST_OPTION_HIDDEN);
            node.classList.remove(DROPDOWN_LIST_OPTION_SELECTED);
        }
    }

    /**
     * Hide dropdown list menu if rendered.
     */
    hide() {
        if (this.dropdownListElement) {
            this.dropdownListElement.classList.add(DROPDOWN_LIST_HIDDEN);
        }
    }

    /**
     * Show dropdown list menu if rendered.
     */
    show() {
        if (this.dropdownListElement) {
            this.dropdownListElement.classList.remove(DROPDOWN_LIST_HIDDEN);
        }

        this.focus();
    }

    /**
     * Toggle display state of dropdown list menu if rendered.
     */
    toggle() {
        if (this.dropdownListElement) {
            this.dropdownListElement.classList.toggle(DROPDOWN_LIST_HIDDEN);
        }
        
       this.focus();
    }

    /**
     * Focus dropdown list search textbox if visible.
     */
    focus() {
        if (!this.dropdownListElement.classList.contains(DROPDOWN_LIST_HIDDEN)) {
            this.dropdownListSearch.focus();
        }
    }

    /**
     * Dispose rendered dropdown list component.
     */
    dispose() {
        if (this.dropdownListOptions) {
            this.dropdownListOptions.removeEventListener('click', this.dropdownListOptionClickEventHandler, false);
        }
        
        if (this.dropdownListSearch) {
            this.dropdownListSearch.removeEventListener('keyup', this.filterEventHandler, false);
        }

        this.filterEventHandler = null;
        this.dropdownListElement = null;
        this.dropdownListSearch = null;
        this.dropdownListOptions = null;
        this.dropdownListNoDataOption = null;
    }
}
