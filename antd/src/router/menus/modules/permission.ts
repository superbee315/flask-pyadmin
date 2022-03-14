import type { MenuModule } from '/@/router/types';
import { t } from '/@/hooks/web/useI18n';

const menu: MenuModule = {
  orderNo: 1,
  menu: {
    path: '/admin',
    name: t('routes.admin.admin'),
    children: [
      {
        path: 'admin',
        name: t('routes.admin.index'),
      },
      {
        path: 'logs',
        name: t('routes.admin.logs'),
      },
      {
        path: 'group',
        name: t('routes.admin.group'),
      },
      {
        path: 'rule',
        name: t('routes.admin.rule'),
        tag: {
          type: 'success',
          content: '菜单',
        },
      },
    ],
  },
};
export default menu;
