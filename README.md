# vue-drag-layout
vue拖动布局

# 如何使用
  - 安装
  ```
    npm install vue-drag-layout --save-dep
  ```

  - 引入

  ```
    import Vue from 'vue';
    import DragToLayout from "vue-drag-layout";

    Vue.use(DragToLayout);
  ```

  - 示例
  ```
    <template>
      <ul>
        <li
          v-for="(item, index) in list"
          :key="index"
          :item="item"
          v-dragToLayout="{
            group: "example",
            list: list,
            item: item,
            // 可选，设置拖拽元素的可拖拽部分
            //
            className: "drag-ele-class"
          }"
        ></li>
      </ul>
    </template>

    <script>
      export default {
        data() {
          return {
            list: [
              {
                id: '1',
                name: 'item1',
              },
              {
                id: '2',
                name: 'item2'
              }
            ]
          };
        },

        mounted() {
          const vm = this;

          vm.$dragging.$on('dragged', ($event) => {
            const {
              dragged,  // 拖拽完成的item
              to,       // 拖拽被替换的item
              group,    // 拖拽分组名
            } = $event;

            ...
          });
        },
      };
    </script>
  ```