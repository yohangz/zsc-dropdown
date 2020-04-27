/**
 * Export dropdown component ES modules.
 */
import { staticDataBindHandler } from './data/data-bind-handler.js';
import { Dropdown } from './components/dropdown.js';
import { debounce } from './utility/event-util.js';

export { staticDataBindHandler, Dropdown, debounce };

// Exposing to global scope can be achieved via following snippet in case if bundler is not available.
// globalThis.zsc = globalThis.zsc || {};
// globalThis.zsc.Dropdown = globalThis.zsc.Dropdown || Dropdown;
// globalThis.zsc.staticDataBindHandler = globalThis.zsc.staticDataBindHandler || staticDataBindHandler;
// globalThis.zsc.debounce = globalThis.zsc.debounce || debounce;
