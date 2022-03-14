<template>
  <ConfigProvider :locale="getAntdLocale">
    <AppProvider>
      <RouterView />
    </AppProvider>
  </ConfigProvider>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { ConfigProvider } from 'ant-design-vue';
  import { AppProvider } from '/@/components/Application';
  import { useAppStore } from '/@/store/modules/app';
  import { useTitle } from '/@/hooks/web/useTitle';
  import { useLocale } from '/@/locales/useLocale';

  export default defineComponent({
    name: 'App',
    components: { ConfigProvider, AppProvider },
    setup() {
      const appStore = useAppStore();
      appStore.setAppInfoAction();
      useTitle();

      // support Multi-language
      const { getAntdLocale } = useLocale();

      return { getAntdLocale };
    },
  });
</script>
<style>
  /* base */
  .ant-form-item-children .dele-file .anticon,
  .ant-form-item-children .dele-image .anticon {
    position: relative;
    bottom: 8px;
  }

  /* 表格自适应 */
  @media (max-width: 639px) {
    .sys-container .vben-basic-table-header__toolbar > * {
      margin-right: 3px !important;
    }

    .sys-container .vben-basic-table .ant-table-wrapper {
      padding: 3px;
    }
  }
</style>
