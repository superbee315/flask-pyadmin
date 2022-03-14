<template>
  <!-- <BasicTable @register="registerTable" /> -->
  <div class="wrap">
    <div class="head">
      <div class="name-head">键名</div>
      <div class="value-head">键值</div>
    </div>
    <div class="array-item">
      <div
        class="content-item"
        v-for="(item, index) in list"
        :key="index"
        :data-no="JSON.stringify(item)"
      >
        <div class="name-content">
          <Input v-model:value="item.name" @change="onChange" />
        </div>
        <div class="value-content">
          <Input v-model:value="item.value" @change="onChange" />
        </div>
        <a-button class="mr-2" preIcon="mdi:close-thick" color="error" @click="remove(index)" />
        <a-button
          v-show="false"
          class="mr-2 drag-btn"
          preIcon="ri:drag-move-2-fill"
          type="primary"
        />
      </div>
    </div>
    <a-button class="add-btn mr-2" size="small" color="success" @click="create"> 追加 </a-button>
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive, toRefs, watch } from 'vue';
  import { Input } from 'ant-design-vue';
  import Sortable from 'sortablejs';
  // import draggable from 'vuedraggable'

  interface Data {
    name: string;
    value: string;
    index: number;
  }
  const props = {
    value: { type: Object, default: {} },
    tip: { type: String, default: '' },
  };

  export default defineComponent({
    components: { Input },
    props,
    emits: ['change'],
    setup(props, { emit }) {
      const state = reactive({
        list: [] as Data[],
        sortList: [] as Data[],
      });
      var sortCom: any = null;

      watch(
        () => props.value,
        (value) => {
          state.list = [];
          let index = 0;
          for (let k in value) {
            state.list.push({ name: k, value: value[k], index });
            index++;
          }
        }
      );

      // 初始化 sortable 实现拖动
      function initSortable() {
        // for (let k in props.value) {
        //   state.list.push({ name: k, value: props.value[k] });
        // }
        state.list = [];
        let index = 0;
        for (let k in props.value) {
          state.list.push({ name: k, value: props.value[k], index });
          index++;
        }
        // state.list = props.value as object[];
        const el = document.querySelector('.array-item') as any;
        sortCom = Sortable.create(el, {
          handle: '.drag-btn',
          sort: true, // boolean 定义是否列表单元是否可以在列表容器内进行拖拽排序
          delay: 0, // number 定义鼠标选中列表单元可以开始拖动的延迟时间；
          touchStartThreshold: 0, // px, how many pixels the point should move before cancelling a delayed drag event
          disabled: false, // boolean 定义是否此sortable对象是否可用，为true时sortable对象不能拖放排序等功能，为false时为可以进行排序，相当于一个开关；
          animation: 150, // ms, number 单位：ms，定义排序动画的时间
          easing: 'cubic-bezier(1, 0, 0, 1)', // Easing for animation. Defaults to null. See https://easings.net/ for examples.
          ghostClass: 'drag-ghost', // drop placeholder的css类名
          draggable: '.content-item', // 允许拖拽的项目类名
          chosenClass: 'sortable-chosen', // 被选中项的css 类名
          dragClass: 'sortable-drag', // 正在被拖拽中的css类名
          group: { name: 'name', pull: true, put: true },
          dataIdAttr: 'data-no',

          // 拖拽完成
          onEnd: function (evt) {
            console.log(evt);
            console.log(`移动前的位置索引`, evt.oldIndex);
            console.log(`移动后的位置索引`, evt.newIndex);
            // // const newIndex = evt.newIndex as number;
            // const oldIndex = evt.oldIndex as number;
            // const newIndex = evt.newIndex as number;
            // const current = state.list[oldIndex];
            // console.log(`state.list.length === before`, state.list.length);
            // state.list.splice(oldIndex, 1);
            // console.log(`state.list.length`, state.list.length);
            // state.list.splice(newIndex, 0, current);
            // console.log(`state.list`, state.list);
            const res = sortCom.toArray();
            // console.log(`res`, res);
            state.sortList = res.map((item) => JSON.parse(item));
            // console.log(`state.list`, state.list);
            console.log(`state.sortList=========`, state.sortList);
            // sortCom.destroy();
            // state.list = [];
            // for (let i = 0; i < state.sortList.length; i++) {
            //   let obj = state.sortList[i];
            //   obj.index = i;
            //   state.list.push(obj);
            // }
            const data = formatList(state.sortList);
            console.info('子组件 data =============', data);
            emit('change', data);
            // initSortable();
            // console.log(`拖动后的数据`, state.sortList);
          },
        });
      }
      onMounted(() => {
        initSortable(); // 开启拖拽功能
      });

      function formatList(list) {
        const data: object = {};
        list.map((item) => {
          data[item.name] = item.value;
        });
        return data;
      }

      function onChange() {
        const data = formatList(state.list);
        emit('change', data);
      }
      function create() {
        state.list.push({ name: '', value: '', index: state.list.length });
      }
      function remove(i) {
        state.list.splice(i, 1);
        const data = formatList(state.list);
        emit('change', data);
      }

      return {
        onChange,
        create,
        remove,
        ...toRefs(state),
      };
    },
  });
</script>
<style scoped>
  .wrap {
    width: 65%;
  }

  .head {
    display: flex;
    text-align: left;
  }

  .name-head {
    width: 25%;
    margin-right: 5px;
    font-weight: bold;
  }

  .value-head {
    width: 50%;
    font-weight: bold;
  }

  .content-item {
    display: flex;
    margin: 5px 0;
  }

  .name-content {
    width: 25%;
    margin-right: 5px;
  }

  .value-content {
    width: 50%;
    margin-right: 5px;
  }

  .add-btn {
    margin-top: 2px;
    color: #fff;
  }
</style>
