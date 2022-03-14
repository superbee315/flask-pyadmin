import { watch, unref } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { useTitle as usePageTitle } from '@vueuse/core';
// import { useGlobSetting } from '/@/hooks/setting';
import { useAppStore } from '/@/store/modules/app';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

import { REDIRECT_NAME } from '/@/router/constant';

export function useTitle() {
  const appStore = useAppStore();
  const title = computed(() => appStore.getAppTitle);
  // const { title } = useGlobSetting();
  const { t } = useI18n();
  const { currentRoute } = useRouter();

  const pageTitle = usePageTitle();

  watch(
    () => currentRoute.value.path,
    () => {
      const route = unref(currentRoute);
      if (route.name === REDIRECT_NAME) {
        return;
      }

      const tTitle = t(route?.meta?.title as string);
      pageTitle.value = tTitle ? ` ${tTitle} - ${title.value} ` : `${title.value}`;
    },
    { immediate: true }
  );
}
