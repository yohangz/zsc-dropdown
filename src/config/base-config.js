const CONFIG = {
  /**
   * Current HTMLDocument reference.
   * Expicitly passsed for testability.
   * @type {HTMLDocument}
   */
  document: window.document,

  /**
   * Target element CSS selector.
   * Dropdown component will render in this target element.
   * @type {string}
   */
  targetElementSelector: 'body',

  /**
   * Default message to display when no options are selected.
   * @type {string}
   */
  defaultSelectText: 'Select Options...',

  /**
   * Message displayed when options list is empty.
   * @type {string}
   */
  noDataMessage: 'Data not available.',

  /**
   * Options list menu width.
   * @type {string}
   */
  optionsMenuWidth: '200px',

  /**
   * Options list menu height.
   * @type {string}
   */
  optionsMenuHeight: '200px',

  /**
   * Dropdown bound data key property identifier.
   * Corresponding value is used to uniquely identify dropdown options.
   * @type {string}
   */
  keyPorpertyIndetifier: 'key',

  /**
   * Dropdown bound data value property identifier.
   * Corresponding value is used as the display text of dropdown options.
   * @type {string}
   */
  valuePropertyIdentifier: 'value',

  /**
   * Starting point of data source.
   * Mainly exposed for future usage of fetch data on scroll functionality.
   * @type {number}
   */
  offset: 0,

  /**
   * Data limit to fetch form offset value.
   * @type {number}
   */
  limit: Infinity,

  /**
   * Default selected options.
   * Use key and value as indicated in keyPorpertyIndetifier and valuePropertyIdentifier properties.
   * @type {Map}
   */
  selected: undefined,

  /**
   * Open dropdown options menu on initial load.
   * @type {boolean}
   */
  openOnLoad: false,

  /**
   * Filter event debounce delay in milliseconds.
   * @type {number}
   */
  filterDebounceDelay: 400,

  /**
   * Filter query text.
   * @type {string}
   */
  query: '',

  // INTERNAL USAGE ONLY

  /**
   * Triggered on selection change event handlers.
   * Triggered with all selected dropdown options when selection changes.
   * Use the public dropdown public interface to listen to this event.
   * @type {function[]}
   */
  onSelectionChange: undefined,

  /**
   * Triggered on option selection chnage.
   * Triggered with selection changed dropdown option.
   * Use the public dropdown public interface to listen to this event.
   * @type {function[]}
   */
  onOptionSelectionChange: undefined,

  /**
   * Triggered on options filter query change.
   * Use the public dropdown public interface to listen to this event.
   * @type {function[]}
   */
  onOptionsFilter: undefined,

  /**
   * Data bind event halder reference
   * @type {function}
   */
  onDataBindCallback: undefined,
};

export default CONFIG;
