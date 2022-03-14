<template>
  <a-tree-select
    show-search
    style="width: 100%"
    v-model:value="value"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    placeholder="Please select"
    allow-clear
    treeCheckable
    :treeCheckStrictly="true"
    tree-default-expand-all
  />
</template>
<script lang="ts">
  import { defineComponent, ref, watch } from 'vue';
  import { TreeSelect } from 'ant-design-vue';

  export default defineComponent({
    name: 'MultipleTreeSelect',
    components: {
      [TreeSelect.name]: TreeSelect,
    },
    setup() {
      const value = ref<string[]>([]);
      watch(value, () => {
        console.log('select', value.value);
      });
      return {
        value,
      };
    },
  });
</script>
