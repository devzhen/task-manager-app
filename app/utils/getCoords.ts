/**
 * Get an element's position relative to a page
 */
const getCoords = (elem: Element) => {
  const box = elem.getBoundingClientRect();

  const body = document.body;
  const docEl = document.documentElement;

  const scrollTop = window.scrollY || docEl.scrollTop || body.scrollTop;
  const scrollLeft = window.scrollX || docEl.scrollLeft || body.scrollLeft;

  const clientTop = docEl.clientTop || body.clientTop || 0;
  const clientLeft = docEl.clientLeft || body.clientLeft || 0;

  const top = box.top + scrollTop - clientTop;
  const left = box.left + scrollLeft - clientLeft;

  return {
    top: Math.round(top),
    left: Math.round(left),
    right: Math.round(left) + box.width,
    bottom: Math.round(top) + box.height,
    middle: Math.round(top) + box.height / 2,
    width: box.width,
    height: box.height,
  };
};

export default getCoords;
