import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const admin: AppRouteModule = {
  path: '/admin',
  name: 'admin',
  component: LAYOUT,
  redirect: '/admin/admin',
  meta: {
    icon: 'bx:bx-lock',
    title: t('routes.admin.admin'),
  },
  children: [
    {
      path: 'admin',
      name: 'Admin',
      component: () => import('/@/views/admin/admin/index.vue'),
      meta: {
        title: t('routes.admin.index'),
        affix: false,
        icon: 'bx:bx-lock',
      },
    },
    {
      path: 'logs',
      name: 'Logs',
      component: () => import('/@/views/admin/logs/index.vue'),
      meta: {
        title: t('routes.admin.logs'),
        affix: false,
        icon: 'bx:bx-lock',
      },
    },
    {
      path: 'group',
      name: 'Group',
      component: () => import('/@/views/admin/group/index.vue'),
      meta: {
        title: t('routes.admin.group'),
        affix: false,
        icon: 'bx:bx-lock',
      },
    },
    {
      path: 'rule',
      name: 'Rule',
      component: () => import('/@/views/admin/rule/index.vue'),
      meta: {
        title: t('routes.admin.rule'),
        affix: false,
        icon: 'bx:bx-lock',
      },
    },
  ],
};

export default admin;
