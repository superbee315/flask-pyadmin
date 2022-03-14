import type { MenuModule } from '/@/router/types';
import { t } from '/@/hooks/web/useI18n';

const menu: MenuModule = {
  orderNo: 2,
  menu: {
    path: '/table',
    name: 'routes.table.table',
    children: [
      {
        path: 'table',
        name: t('routes.table.basic'),
      },
      {
        path: 'edit',
        name: t('routes.table.edit'),
      },
      {
        path: 'image',
        name: t('routes.table.image'),
      },
      {
        path: 'attachment',
        name: t('routes.table.file'),
      },
    ],
  },
};
export default menu;
