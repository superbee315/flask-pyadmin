<template>
  <!-- <BasicTable @register="registerTable" /> -->
  <div class="arr-wrap">
    <div class="arr-head">
      <div class="value-item-head">关系</div>
      <div class="value-item-head">姓名</div>
      <div class="value-item-head">年龄</div>
      <div class="value-item-head">工作单位</div>
      <div class="value-item-head">职务</div>
    </div>
    <div class="array-item">
      <div class="arr-content-item" v-for="(item, index) in list" :key="index">
        <div class="value-item-content">
          <Input v-model:value="item.relation" @change="onChange" />
        </div>
        <div class="value-item-content">
          <Input v-model:value="item.name" @change="onChange" />
        </div>
        <div class="value-item-content">
          <Input type="number" v-model:value="item.age" @change="onChange" />
        </div>
        <div class="value-item-content">
          <Input v-model:value="item.company" @change="onChange" />
        </div>
        <div class="value-item-content">
          <Input v-model:value="item.job" @change="onChange" />
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
    name: 'FamilyArrCom',
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
        state.list.push({ relation: '', name: '', age: '', company: '', job: '' });
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
    width: 93%;
    text-align: left;
    justify-content: space-around;
  }

  .value-item-head {
    width: 20%;
    font-weight: bold;
    line-height: 20px;
  }

  .arr-content-item {
    display: flex;
    margin: 5px 0;
  }

  .value-item-content {
    /* width: 50%; */
    margin-right: 2px;
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
