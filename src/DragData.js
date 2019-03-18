/**
 * @description DragData
 * @author      tangerine
 */

class DragData {
  constructor() {
    this.data = {};
  }

  new(key) {
    if (!this.data[key]) {
      this.data[key] = {
        className: '',
        list: [],
        KEY_MAP: {}
      };
    }

    return this.data[key];
  }

  get(key) {
    return this.data[key];
  }
}

export default DragData;
