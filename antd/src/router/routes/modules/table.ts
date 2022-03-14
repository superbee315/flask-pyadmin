import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const table: AppRouteModule = {
  path: '/table',
  name: 'Table',
  component: LAYOUT,
  redirect: '/table/table',
  meta: {
    icon: 'bx:bx-table',
    title: t('routes.table.table'),
  },
  children: [
    {
      path: 'table',
      name: 'Table',
      component: () => import('/@/views/table/table/index.vue'),
      meta: {
        title: t('routes.table.table'),
        icon: 'ant-design:table-outlined',
      },
    },
    {
      path: 'edit',
      name: 'Edit',
      component: () => import('/@/views/table/editTable/index.vue'),
      meta: {
        title: t('routes.table.edit'),
        icon: 'ant-design:table-outlined',
      },
    },
    {
      path: 'attachment',
      name: 'Attachment',
      component: () => import('/@/views/table/attachment/index.vue'),
      meta: {
        title: t('routes.table.file'),
        icon: 'ant-design:table-outlined',
      },
    },
    {
      path: 'image',
      name: 'Image',
      component: () => import('/@/views/table/imageTable/index.vue'),
      meta: {
        title: t('routes.table.image'),
        icon: 'ant-design:table-outlined',
      },
    },
  ],
};

export default table;
