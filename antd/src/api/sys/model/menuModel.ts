import { RouteMeta } from '/@/router/types';
import type { AppRouteRecordRaw } from '/@/router/types';
export interface RouteItem {
  path: string;
  component: any;
  meta: RouteMeta;
  name?: string;
  alias?: string | string[];
  redirect?: string;
  caseSensitive?: boolean;
  children?: RouteItem[];
}

/**
 * @description: Get menu return value
 */
export type getMenuListResultModel = AppRouteRecordRaw[];
