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

  static setStyle(el, style) {
    const originalStyle = eleStyleMap.get(el) || {};

    if (style instanceof String) {
      // eg: 'margin-left: 10px; height: 10px;'
      style.split(/\s*;\s*/g).forEach((_style) => {
        const [attr, value] = _style.split(/\s*:\s*/g);

        originalStyle[domUtils.toCamel(attr)] = domUtils.getStyle(el, attr);
        el.style[domUtils.toCamel(attr)] = value;
      });
    }

    if (style instanceof Object) {
      // eg: { marginLeft: '10px', height: '10px' }
      //eslint-disable-next-line no-restricted-syntax
      for (const [attr, value] of Object.entries(style)) {
        originalStyle[domUtils.toCamel(attr)] = domUtils.getStyle(el, attr);
        el.style[domUtils.toCamel(attr)] = value;
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
        el.style[domUtils.toCamel(attr)] = originalStyle[domUtils.toCamel(attr)] || 'none';
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
