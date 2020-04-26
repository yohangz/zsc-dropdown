import { createElement, createDropdownOption } from '../utility/dom-util.js';

import { DROPDOWN_SELECT_ROOT, DROPDOWN_SELECT_DEFAULT, DROPDOWN_SELECT_DEFAULT_HIDDEN, DROPDOWN_SELECT_ARROW, DROPDOWN_SELECT_OPTIONS, DROPDOWN_SELECT_OPTION } from '../config/local-config.js';

/**
 * Dropdown selection view which lists the selected dropdown options.
 */
export class DropdownSelect {
  /**
   * Factory method to create an instance of DropdownSelect.
   * This will allow us to easily mock the usages in unit test specs.
   * @param {BasaeConfig} config Dropdown base configuration object.
   * @return {DropdownSelect} Dropdown select instance.
   */
  static createInstance(config) {
    return new DropdownSelect(config);
  }

  /**
   * Dropdown select constructor.
   * @param {BasaeConfig} config Dropdown base configuration object.
   */
  constructor(config) {
    this.config = config;
  }

  /**
   * Render dropdown select component asssociated markup.
   * @return {HTMLDivElement} Dropdown select view root element.
   */
  render() {
    const doc = this.config.document;

    // Create select view root element
    const dropdownSelect = createElement(doc, DROPDOWN_SELECT_ROOT);

    // Create default text label which is displayed when no options are selected.
    const dropdownSelectDefaulText = createElement(doc, DROPDOWN_SELECT_DEFAULT, 'span');
    dropdownSelectDefaulText.textContent = this.config.defaultSelectText;
    dropdownSelect.appendChild(dropdownSelectDefaulText);

    // Create selected options list root.
    const dropdownSelectOptions = createElement(doc, DROPDOWN_SELECT_OPTIONS, 'ul');
    dropdownSelect.appendChild(dropdownSelectOptions);

    const dropdownSelectClear = createElement(doc, DROPDOWN_SELECT_ARROW);

    this.dropdownSelectDefaulText = dropdownSelectDefaulText;
    this.dropdownSelectOptions = dropdownSelectOptions;

    this.initDefaultSelectedOptions();
    this.bindOptionSelectionChangeEvent();

    dropdownSelect.appendChild(dropdownSelectClear);

    return dropdownSelect;
  }

  /**
   * Dispose rendered dropdown select component.
   */
  dispose() {
    this.dropdownSelectDefaulText = null;
    this.dropdownSelectOptions = null;
  }

  /**
   * @private
   * Initialize default selected options.
   * Hide select options message and display seleted options.
   */
  initDefaultSelectedOptions() {
    if (this.config.selected.size) {
      this.dropdownSelectDefaulText.classList.add(DROPDOWN_SELECT_DEFAULT_HIDDEN);

      for (let [key, value] of this.config.selected) {
        this.dropdownSelectOptions.appendChild(createDropdownOption(this.config.document, key, value, DROPDOWN_SELECT_OPTION));
      }
    }
  }

  /**
   * @private
   * Bind options selection change event handler.
   * This event handler listen to options selection changes in dropdown list and add selected options.
   */
  bindOptionSelectionChangeEvent() {
    this.config.onOptionSelectionChange.push(({ key, value, selected }) => {
      if (selected) {
        this.dropdownSelectOptions.appendChild(createDropdownOption(this.config.document, key, value, DROPDOWN_SELECT_OPTION));
      } else {
        let element = this.dropdownSelectOptions.querySelector(`li[data-key='${key}']`);
        element.remove();
      }

      if (!this.dropdownSelectOptions.children.length) {
        this.dropdownSelectDefaulText.classList.remove(DROPDOWN_SELECT_DEFAULT_HIDDEN);
      } else {
        this.dropdownSelectDefaulText.classList.add(DROPDOWN_SELECT_DEFAULT_HIDDEN);
      }
    });
  }
}
