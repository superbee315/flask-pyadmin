import type { MenuModule } from '/@/router/types';
import { t } from '/@/hooks/web/useI18n';
const menu: MenuModule = {
  orderNo: 3,
  menu: {
    path: '/test',
    name: t('routes.table.test'),
    children: [
      {
        path: 'basic',
        name: t('routes.table.toggletest'),
      },
    ],
  },
};
export default menu;
