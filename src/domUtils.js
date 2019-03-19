/**
 * @description DOM工具
 * @author      tangerine
 */

const eleStyleMap = new Map();

class domUtils {
  static on(el, type, fn) {
    el.addEventListener(type, fn);
  }

  static off(el, type, fn) {
    el.removeEventListener(type, fn);
  }

  static getStyle(el, attr) {
    return el.currentStyle
      ? el.currentStyle[attr]
      : getComputedStyle(el, null)[attr];
  }

  static toCamel(str) {
    return str.replace(/\\-([a-zA-Z])/g, ($, $1) => $1.toUpperCase());
  }

  static has(obj, attr) {
    return Object.prototype.hasOwnProperty.call(obj, attr);
  }

  static setStyle(el, style) {
    const originalStyle = eleStyleMap.get(el) || {};

    if (style instanceof String) {
      // eg: 'margin-left: 10px; height: 10px;'
      style.split(/\s*;\s*/g).forEach((_style) => {
        const [attr, value] = _style.split(/\s*:\s*/g);
        const _attr = domUtils.toCamel(attr);

        if (!(domUtils.has(originalStyle, _attr))) {
          originalStyle[_attr] = domUtils.getStyle(el, attr);
        }

        el.style[_attr] = value;
      });
    }

    if (style instanceof Object) {
      // eg: { marginLeft: '10px', height: '10px' }
      for (const [attr, value] of Object.entries(style)) {
        const _attr = domUtils.toCamel(attr);

        if (!domUtils.has(originalStyle, _attr)) {
          originalStyle[_attr] = domUtils.getStyle(el, attr);
        }

        el.style[_attr] = value;
      }
    }

    eleStyleMap.set(el, originalStyle);
  }

  static resetStyle(el, style) {
    // style: eg: { marginLeft: '10px', height: '10px' }
    const originalStyle = eleStyleMap.get(el) || {};

    if (style instanceof Object) {
      //eslint-disable-next-line no-restricted-syntax
      for (const [attr] of Object.entries(style)) {
        const _attr = domUtils.toCamel(attr);

        el.style[_attr] = originalStyle[_attr] || 'none';
      }
    }
  }

  static hasClass(el, cls) {
    const { className } = el;

    return (new RegExp(`\\b${cls}\\b`)).test(className);
  }

  static getElementFromMouseEvent(e) {
    const { pageX, pageY } = e;

    return document.elementFromPoint(pageX, pageY);
  }
}

export default domUtils;
