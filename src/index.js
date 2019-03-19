/**
 * @description 元素可拖拽
 * @author      tangerine
 */

import DragData from './DragData';
import $dragging from './dragging';
import domUtils from './domUtils';
import dragStyles from './style';

const ELEMENT_ATTRS = {
  // 是否可拖拽 html5属性
  DRAGGABLE: 'draggable',
  // 拖拽目标确定
  DRAG_BLOCK: 'drag_block',
  // 拖拽分组
  DRAG_GROUP: 'drag_group',
  // 标识
  DRAG_KEY: 'drag_key'
};

export default function (Vue, options = { autoSwap: false }) {
  const dragData = new DragData();
  let Current = null;

  /**
   * 合并自定义样式
   */
  if (
    options
    && options instanceof Object
  ) {
    Object.assign(dragStyles, options);
  }

  /**
   * 获取元素
   */
  function getBlockEl(el) {
    if (!el) {
      return null;
    }

    const key = el.getAttribute(ELEMENT_ATTRS.DRAG_GROUP);
    const _dragData = dragData.new(key);

    while (el) {
      if (
        el.getAttribute
        && el.getAttribute(ELEMENT_ATTRS.DRAG_BLOCK)
      ) {
        return el;
      // eslint-disable-next-line no-else-return
      } else {
        el = el.parentNode;
      }
    }

    return null;
  }

  /**
   * 验证元素是否合法: 拖拽是否在指定className元素之上
   */
  function validateEl(e) {
    const key = e.target.getAttribute(ELEMENT_ATTRS.DRAG_GROUP);
    const _dragData = dragData.new(key);
    const { className } = _dragData;
    let el = domUtils.getElementFromMouseEvent(e);

    if (!className) {
      return true;
    }

    while (el) {
      if (domUtils.hasClass(el, className)) {
        return true;
      } else if (el == e.target) {
        return false;
      } else {
        el = el.parentNode;
      }
    }

    return false;
  }

  /**
   * 元素是否属于当前拖拽分组
   */
  function eleIsInCurrentGroup(ele) {
    if (
      !ele ||
      !Current ||
      !Current.el ||
      !Current.item ||
      !Current.group
    ) {
      return false;
    }

    return ele.getAttribute(ELEMENT_ATTRS.DRAG_GROUP) == Current.group;
  }

  /**
   * 交换数组item
   */
  function swapArrayElements(items, indexFrom, indexTo) {
    const item = items[indexTo];

    Vue.set(items, indexTo, items[indexFrom]);
    Vue.set(items, indexFrom, item);
  }

  /**
   * 处理拖拽开始
   */
  function handleDragStart(e) {
    const el = getBlockEl(e.target);
    const valid = validateEl(e);

    if (!(el && valid)) {
      e.preventDefault();

      return;
    }

    const key = el.getAttribute(ELEMENT_ATTRS.DRAG_GROUP);
    const dragKey = el.getAttribute(ELEMENT_ATTRS.DRAG_KEY);
    const _dragData = dragData.new(key);
    const item = _dragData.KEY_MAP[dragKey];
    const index = _dragData.list.indexOf(item);

    domUtils.setStyle(
      el,
      dragStyles.dragging
    );

    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text', JSON.stringify(item));
    }

    Current = {
      group: key,
      index,
      item,
      el,
    };
  }

  /**
   * 处理拖拽Over
   */
  function handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }

    return false;
  }

  /**
   * 处理拖拽进入
   */
  function handleDragEnter(e) {
    const el = getBlockEl(e.target);

    if (!el) {
      e.preventDefault();

      return;
    }

    if (
      !eleIsInCurrentGroup(el) ||
      el == Current.el
    ) {
      return;
    }

    domUtils.setStyle(
      el,
      dragStyles.dragOvering
    );

    if (!options.autoSwap) {
      return;
    }

    const key = el.getAttribute(ELEMENT_ATTRS.DRAG_GROUP);
    const dragKey = el.getAttribute(ELEMENT_ATTRS.DRAG_KEY);
    const _dragData = dragData.new(key);
    const item = _dragData.KEY_MAP[dragKey];

    if (item == Current.item) {
      return;
    }

    const indexTo = _dragData.list.indexOf(item);
    const indexFrom = _dragData.list.indexOf(Current.item);
    swapArrayElements(_dragData.list, indexFrom, indexTo);

    Current.index = indexTo;
    $dragging.$emit('dragged', {
      dragged: Current.item,
      to: item,
      value: _dragData.value,
      group: key
    });
  }

  /**
   * 处理拖拽离开
   */
  function handleDragLeave(e) {
    const el = getBlockEl(e.target);

    if (!el) {
      e.preventDefault();

      return;
    }

    if (el.contains(domUtils.getElementFromMouseEvent(e))) {
      return;
    }

    if (
      !eleIsInCurrentGroup(el) ||
      el == Current.el
    ) {
      return;
    }

    domUtils.resetStyle(
      el,
      dragStyles.dragOvering
    );
  }

  /**
   * 处理拖拽
   */
  function handleDrag(e) {
  }

  /**
   * 处理拖拽结束
   */
  function handleDragEnd(e) {
    const el = getBlockEl(e.target);

    if (!el) {
      e.preventDefault();

      return;
    }

    domUtils.resetStyle(
      Current.el,
      dragStyles.dragOvering,
    );
    Current = null;

    const group = el.getAttribute(ELEMENT_ATTRS.DRAG_GROUP);
    $dragging.$emit('dragend', {
      group
    });
  }

  /**
   * 处理拖拽Drop
   */
  function handleDrop(e) {
    const el = getBlockEl(e.target);

    if (!el) {
      e.preventDefault();

      return;
    }

    if (options.autoSwap) {
      domUtils.resetStyle(
        el,
        dragStyles.dragOvering
      );
      return;
    }

    if (
      !eleIsInCurrentGroup(el) ||
      el == Current.el
    ) {
      return;
    }

    domUtils.resetStyle(
      Current.el,
      dragStyles.dragging
    );
    domUtils.resetStyle(
      el,
      dragStyles.dragOvering
    );

    const key = el.getAttribute(ELEMENT_ATTRS.DRAG_GROUP);
    const dragKey = el.getAttribute(ELEMENT_ATTRS.DRAG_KEY);
    const _dragData = dragData.new(key);
    const item = _dragData.KEY_MAP[dragKey];
    const indexTo = _dragData.list.indexOf(item);
    const indexFrom = _dragData.list.indexOf(Current.item);
    swapArrayElements(_dragData.list, indexFrom, indexTo);

    Current.index = indexTo;
    $dragging.$emit('dragged', {
      dragged: Current.item,
      to: item,
      value: _dragData.value,
      group: key
    });
  }

  /**
   * 使元素可拖拽
   */
  function addDragItem(el, binding, vnode) {
    const {
      item,
      list,
      group,
      className
    } = binding.value;
    const _dragData = dragData.new(group);
    const dragKey = vnode.key || binding.value.key;

    _dragData.value = binding.value;
    _dragData.className = className;
    _dragData.KEY_MAP[dragKey] = item;

    if (list && list != _dragData.list) {
      _dragData.list = list;
    }

    el.setAttribute(ELEMENT_ATTRS.DRAGGABLE, true);
    el.setAttribute(ELEMENT_ATTRS.DRAG_GROUP, group);
    el.setAttribute(ELEMENT_ATTRS.DRAG_BLOCK, group);
    el.setAttribute(ELEMENT_ATTRS.DRAG_KEY, dragKey);

    domUtils.on(el, 'dragstart', handleDragStart);
    domUtils.on(el, 'dragenter', handleDragEnter);
    domUtils.on(el, 'dragover', handleDragOver);
    domUtils.on(el, 'drag', handleDrag);
    domUtils.on(el, 'dragleave', handleDragLeave);
    domUtils.on(el, 'dragend', handleDragEnd);
    domUtils.on(el, 'drop', handleDrop);
  }

  /**
   * 使元素失去拖拽
   */
  function removeDragItem(el, binding, vnode) {
    const _dragData = dragData.new(binding.value.group);
    const dragKey = vnode.key || binding.value.key;

    delete _dragData.KEY_MAP[dragKey];

    domUtils.off(el, 'dragstart', handleDragStart);
    domUtils.off(el, 'dragenter', handleDragEnter);
    domUtils.off(el, 'dragover', handleDragOver);
    domUtils.off(el, 'drag', handleDrag);
    domUtils.off(el, 'dragleave', handleDragLeave);
    domUtils.off(el, 'dragend', handleDragEnd);
    domUtils.off(el, 'drop', handleDrop);
  }

  Vue.prototype.$dragging = $dragging;
  Vue.directive('dragToLayout', {
    bind: addDragItem,
    update(el, binding, vnode) {
      const {
        group, item, list, className
      } = binding.value;
      const _dragData = dragData.new(group);
      const dragKey = vnode.key || binding.value.key;
      const oldItem = _dragData.KEY_MAP[dragKey];

      if (
        item &&
        item != oldItem
      ) {
        _dragData.KEY_MAP[dragKey] = item;
      }

      if (
        list &&
        list != _dragData.list
      ) {
        _dragData.list = list;
      }

      _dragData.className = className;
    },
    unbind: removeDragItem
  });
}
