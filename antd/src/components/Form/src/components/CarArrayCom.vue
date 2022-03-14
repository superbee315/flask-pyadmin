<template>
  <!-- <BasicTable @register="registerTable" /> -->
  <div class="arr-wrap">
    <div class="arr-head">
      <div class="value-item-head">车主</div>
      <div class="value-item-head">车牌号</div>
    </div>
    <div class="array-item">
      <div class="arr-content-item" v-for="(item, index) in list" :key="index">
        <div class="value-item-content">
          <Input v-model:value="item.name" @change="onChange" />
        </div>
        <div class="value-item-content">
          <Input v-model:value="item.code" @change="onChange" />
        </div>
        <a-button
          class="mr-2 arr-delete-btn"
          preIcon="mdi:close-thick"
          color="error"
          @click="remove(index)"
        />
      </div>
    </div>
    <a-button class="arr-add-btn mr-2" size="small" color="success" @click="create">
      追加
    </a-button>
  </div>
</template>
<script lang="ts">
  import { defineComponent, onUpdated, reactive, nextTick, toRefs, watch } from 'vue';
  import { Input } from 'ant-design-vue';
  import { propTypes } from '/@/utils/propTypes';

  const props = {
    value: propTypes.oneOfType([propTypes.object, propTypes.string, propTypes.array]),
    placeholder: { type: String, default: '' },
  };

  export default defineComponent({
    name: 'CarArrayCom',
    components: { Input },
    props,
    emits: ['change'],
    setup(props, { emit }) {
      const state = reactive({
        list: [] as any,
      });
      // 初始化
      function init() {
        nextTick(() => {
          state.list = props.value;
        });
      }
      watch(props.value as any, (value: object[]) => {
        state.list = value;
      });
      onUpdated(() => {
        init();
      });

      function onChange() {
        emit('change', state.list);
      }
      function create() {
        state.list.push({ name: '', code: '' });
      }
      function remove(i) {
        state.list.splice(i, 1);
        emit('change', state.list);
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
  .arr-head {
    display: flex;
    width: 100%;
    text-align: left;
  }

  .value-item-head {
    width: 43%;
    font-weight: bold;
    line-height: 20px;
  }

  .arr-content-item {
    display: flex;
    margin: 5px 0;
  }

  .value-item-content {
    /* width: 50%; */
    margin-right: 10px;
  }

  .arr-delete-btn {
    position: relative;
    top: 5px;
    padding: 5px;
  }

  .arr-add-btn {
    margin-top: 2px;
    color: #fff;
  }
</style>
