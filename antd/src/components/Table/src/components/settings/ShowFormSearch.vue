<template>
  <Tooltip placement="top">
    <template #title>
      <span v-if="state">{{ t('component.table.showFormSearchConfig') }}</span>
      <span v-if="!state">{{ t('component.table.hideFormSearchConfig') }}</span>
    </template>
    <SearchOutlined @click="toggle" />
  </Tooltip>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { Tooltip } from 'ant-design-vue';
  import { SearchOutlined } from '@ant-design/icons-vue';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { useTableContext } from '../../hooks/useTableContext';

  export default defineComponent({
    name: 'ShowFormSearch',
    components: {
      SearchOutlined,
      Tooltip,
    },
    setup() {
      const state = ref(true);
      const table = useTableContext();
      const { t } = useI18n();

      function toggle() {
        state.value = !state.value;
        table.showTableSearch();
      }

      return { toggle, t, state };
    },
  });
</script>
