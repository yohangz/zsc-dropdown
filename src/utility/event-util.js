/**
 * Register docuemnt outside click reletive to a target element root.
 * This method is used can be used to identify whether click taget is within target dom hierarchy.
 * @param {HTMLDocument} doc Docuemnt object.
 * @param {HTMLElement} excludeRoot Exclude hierarchy root.
 * @param {function} outsideClickHandler Callback function which gets triggered if click is originated from outside.
 * @return {function} Dispose attached handlers callback.
 */
export function registerClickOutside(doc, excludeRoot, outsideClickHandler) {
  const trackOutsideClick = (event) => {
    if (!excludeRoot.contains(event.target)) {
      outsideClickHandler();
    }
  };

  doc.addEventListener('click', trackOutsideClick);
  doc.addEventListener('touchstart', trackOutsideClick);

  return () => {
    doc.removeEventListener('click', trackOutsideClick);
    doc.removeEventListener('touchstart', trackOutsideClick);
  };
}

/**
 * Create a debounce function that delays invocation of callback function until after delay duration.
 * @param {function} callback Handler callback
 * @param {number} delay Delay in milliseconds.
 * @returns {function} Function reference wrapping original callback.
 */
export function debounce(callback, delay) {
  let ref = null;

  return (...args) => {
    const differCallback = () => {
      callback.apply(this, args);
      ref = null;
    };

    clearTimeout(ref);
    ref = setTimeout(differCallback, delay);
  };
}
