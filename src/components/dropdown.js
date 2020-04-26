import { DropdownSelect } from './dropdown-select.js';
import { DropdownList } from './dropdown-list.js';

import { createElement, removeChildNodes } from '../utility/dom-util.js';
import { registerClickOutside } from '../utility/event-util.js';

import CONFIG from '../config/base-config.js';
import { DROPDOWN_ROOT } from '../config/local-config.js';

/**
 * Multi select dropdown component entry point.
 */
export class Dropdown {
  /**
   * @typedef BasaeConfig
   * @type {object}
   * @property {string} targetElementSelector Dropdown component will render in this target element.
   * @property {string} defaultSelectText Default message to display when no options are selected.
   * @property {string} noDataMessage Message displayed when options list is empty.
   * @property {string} optionsMenuWidth Options list menu width.
   * @property {string} optionsMenuHeight Options list menu height.
   * @property {string} keyPorpertyIndetifier Dropdown bound data key property identifier. Corresponding value is used to uniquely identify dropdown options.
   * @property {string} valuePropertyIdentifier Dropdown bound data value property identifier. Corresponding value is used as the display text of dropdown options.
   * @property {number} offset Starting point of data source. Mainly exposed for future usage of fetch data on scroll functionality.
   * @property {number} limit Data limit to fetch form offset value.
   * @property {Map} selected Default selected options. Use key and value as indicated in keyPorpertyIndetifier and valuePropertyIdentifier properties.
   * @property {boolean} openOnLoad Open dropdown options menu on initial load.
   * @property {number} filterDebounceDelay Filter event debounce delay in milliseconds.
   * @property {string} query Filter query text.
   */

  /**
   * Multi select dropdown constructor.
   * @param {BasaeConfig} config Dropdown configuration.
   */
  constructor(config) {
    this.config = {
      ...CONFIG,
      // avoid creating shallow copies of collection types.
      selected: new Map(),
      onSelectionChange: [],
      onOptionSelectionChange: [],
      onOptionsFilter: [],
      ...config,
    };

    // Find dropdown root DOM refernece.
    this.targetElement = this.config.document.querySelector(this.config.targetElementSelector);
    if (!this.targetElement) {
      throw new Error('Target element not found.');
    }

    this.dropdownSelect = DropdownSelect.createInstance(this.config);
    this.dropdownList = DropdownList.createInstance(this.config);
    this.initialLoad = true;
    this.data = [];

    this.renderDropdownList = this.renderDropdownList.bind(this);
  }

  /**
   * On data bind event handler.
   * This handler is used to fetch data from any data source.
   * Decouples data fetch logic from dropdown component.
   * Use static data bind handler for client side binding.
   * @param {*} dataBindCallback Data bind event handler callback.
   * @returns {Dropdown} self reference.
   */
  onDataBind(dataBindCallback) {
    if (typeof dataBindCallback !== 'function') {
      throw new Error('On data bind event handler must be a function.');
    }

    this.config.onDataBindCallback = dataBindCallback;
    return this;
  }

  /**
   * On dropdown selection change event handler.
   * Triggered with all selected options as an argument.
   * @param {*} selectionChangeCallback
   * @returns {Dropdown} self reference.
   */
  onSelectionChange(selectionChangeCallback) {
    if (typeof selectionChangeCallback !== 'function') {
      throw new Error('On select change event handler must be a function.');
    }

    this.config.onSelectionChange.push(selectionChangeCallback);
    return this;
  }

  /**
   * On dropdown option selection change event handler.
   * Triggered only with selection changed option as an argument.
   * @param {*} selectionChangeCallback
   * @returns {Dropdown} self reference.
   */
  onOptionSelectionChange(optionSelectionChange) {
    if (typeof optionSelectionChange !== 'function') {
      throw new Error('On option select change event handler must be a function.');
    }

    this.config.onOptionSelectionChange.push(optionSelectionChange);
    return this;
  }

  /**
   * Render dropdown component.
   * @returns {Dropdown} self reference.
   */
  redner() {
    if (!this.config.onDataBindCallback) {
      throw new Error('Data bind handler is requried.');
    }

    const doc = this.config.document;

    // Clear all child nodes before rendering.
    removeChildNodes(this.targetElement);

    const dropdownRoot = createElement(doc, DROPDOWN_ROOT);
    this.dropdownRoot = dropdownRoot;

    // Prefetch data and build data trie on init.
    this.data = this.config.onDataBindCallback(this.config);

    this.dropdownSelectElement = this.dropdownSelect.render();
    dropdownRoot.appendChild(this.dropdownSelectElement);

    // Load dropdown options list on init if open on load flag is true.
    if (this.config.openOnLoad) {
      this.renderDropdownList();
    }

    // Bind on select view event click handler to open dropdown list menu.
    this.dropdownSelectElement.addEventListener('click', this.renderDropdownList, false);

    // Register click outside event handler to hide dropdown menu if visible.
    this.disposeOutsideClick = registerClickOutside(doc, this.targetElement, () => {
      if (this.dropdownListElement) {
        this.dropdownList.hide();
      }
    });

    // Trigger data bind on filter query change.
    this.config.onOptionsFilter.push((query) => {
      this.config.query = query;
      this.dropdownList.dataBind(this.config.onDataBindCallback(this.config));
    });

    this.targetElement.appendChild(dropdownRoot);

    return this;
  }

  /**
   * Dispose rendered dropdown component.
   */
  dispose() {
    this.dropdownSelect.dispose();
    this.dropdownSelect = null;

    this.dropdownList.dispose();
    this.dropdownList = null;

    if (this.disposeOutsideClick) {
      this.disposeOutsideClick();
      this.disposeOutsideClick = null;
    }

    if (this.dropdownSelectElement) {
      this.dropdownSelectElement.removeEventListener('click', this.renderDropdownList);
    }

    this.dropdownListElement = null;
    this.dropdownSelectElement = null;
    this.dropdownRoot = null;

    this.config.onDataBindCallback = null;
    this.config.onOptionSelectionChange = null;
    this.config.onSelectionChange = null;
    this.config.onOptionsFilter = null;

    removeChildNodes(this.targetElement);
    this.targetElement = null;
  }

  /**
   * @private
   * Render dropdiown list.
   */
  renderDropdownList() {
    if (!this.dropdownListElement) {
      this.dropdownListElement = this.dropdownList.render(this.data);
      this.dropdownRoot.appendChild(this.dropdownListElement);
      this.dropdownList.focus();
    } else {
      this.dropdownList.toggle();
    }
  }
}
