/**
 * @description 事件监听
 * @author      tangerine
 */

const $dragging = {
  listeners: {},
  $on(event, func) {
    const events = this.listeners[event];

    if (!events) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(func);
  },
  $once(event, func) {
    const vm = this;

    function on(...args) {
      vm.$off(event, on);
      func.apply(vm, args);
    }

    this.$on(event, on);
  },
  $off(event, func) {
    const events = this.listeners[event];

    if (!events || !func) {
      this.listeners[event] = [];

      return;
    }

    this.listeners[event] = this.listeners[event].filter(i => i !== func);
  },
  $emit(event, ...args) {
    const events = this.listeners[event];

    if (
      events &&
      events.length
    ) {
      events.forEach(fun => fun(...args));
    }
  }
};

export default $dragging;
