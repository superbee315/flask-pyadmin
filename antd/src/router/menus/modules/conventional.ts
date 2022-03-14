import type { MenuModule } from '/@/router/types';
import { t } from '/@/hooks/web/useI18n';

const menu: MenuModule = {
  orderNo: 1,
  menu: {
    path: '/conventional',
    name: t('routes.conventional.conventional'),
    children: [
      {
        path: 'person',
        name: t('routes.conventional.person'),
      },
      {
        path: 'system',
        name: t('routes.conventional.system'),
      },
    ],
  },
};
export default menu;
