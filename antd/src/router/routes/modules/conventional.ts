import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const general: AppRouteModule = {
  path: '/general',
  name: 'General',
  component: LAYOUT,
  redirect: '/general/config',
  meta: {
    icon: 'eva:settings-outline',
    title: t('routes.general.conventional'),
  },
  children: [
    // {
    //   path: 'person',
    //   name: 'Person',
    //   component: () => import('/@/views/general/person/index.vue'),
    //   meta: {
    //     title: t('routes.general.person'),
    //     icon: 'ri:user-settings-line',
    //   },
    // },
    {
      path: 'config',
      name: 'Config',
      component: () => import('/@/views/general/config/index.vue'),
      meta: {
        title: t('routes.general.system'),
        icon: 'ri:list-settings-line',
      },
    },
  ],
};

export default general;
