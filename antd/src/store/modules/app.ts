import type { ProjectConfig } from '/#/config';
import type { BeforeMiniState, UserAccount } from '/#/store';

import { defineStore } from 'pinia';
import { store } from '/@/store';

import { ThemeEnum } from '/@/enums/appEnum';
import {
  APP_DARK_MODE_KEY_,
  PROJ_CFG_KEY,
  REMEMBER_ME_KEY_,
  USER_ACCOUNT_KEY_,
} from '/@/enums/cacheEnum';
import { Persistent } from '/@/utils/cache/persistent';
import { darkMode } from '/@/settings/designSetting';
import { resetRouter } from '/@/router';
import { deepMerge } from '/@/utils';
import { getAppInfo } from '/@/api/sys/general';
import Cookies from 'js-cookie';

interface AppState {
  darkMode?: ThemeEnum;
  // Page loading status
  pageLoading: boolean;
  // project config
  projectConfig: ProjectConfig | null;
  // When the window shrinks, remember some states, and restore these states when the window is restored
  beforeMiniInfo: BeforeMiniState;
  appTitle: string;
  appLogo: string;
  userAccount: UserAccount; // 用户账号密码
  rememberMe: boolean; // 记住账号
}
let timeId: TimeoutHandle;
export const useAppStore = defineStore({
  id: 'app',
  state: (): AppState => ({
    darkMode: undefined,
    pageLoading: false,
    projectConfig: Persistent.getLocal(PROJ_CFG_KEY),
    beforeMiniInfo: {},
    appTitle: 'admin',
    appLogo: '',
    rememberMe: false,
    userAccount: {
      account: '',
      password: '',
    },
  }),
  getters: {
    getPageLoading() {
      return this.pageLoading;
    },
    getAppTitle() {
      return this.appTitle;
    },
    getAppLogo() {
      return this.appLogo;
    },
    getDarkMode(): 'light' | 'dark' | string {
      return this.darkMode || localStorage.getItem(USER_ACCOUNT_KEY_) || darkMode;
    },

    getBeforeMiniInfo() {
      return this.beforeMiniInfo;
    },

    getProjectConfig(): ProjectConfig {
      return this.projectConfig || ({} as ProjectConfig);
    },

    getHeaderSetting() {
      return this.getProjectConfig.headerSetting;
    },
    getMenuSetting() {
      return this.getProjectConfig.menuSetting;
    },
    getTransitionSetting() {
      return this.getProjectConfig.transitionSetting;
    },
    getMultiTabsSetting() {
      return this.getProjectConfig.multiTabsSetting;
    },
    getRemember() {
      return this.rememberMe || Cookies.get(REMEMBER_ME_KEY_) === 'true';
    },
    getUserAccount(): UserAccount {
      //如果用户名 密码不为空就不用访问cookies
      if (this.userAccount.account && this.userAccount.password) {
        return this.userAccount;
      } else {
        const userAccount_str = Cookies.get(USER_ACCOUNT_KEY_);
        if (userAccount_str) {
          this.userAccount = JSON.parse(userAccount_str);
        }

        return this.userAccount;
      }
    },
  },
  actions: {
    setUserAccount(userAccount): void {
      this.userAccount = userAccount;
      Cookies.set(USER_ACCOUNT_KEY_, JSON.stringify(userAccount));
    },
    setRemember(mode: boolean): void {
      this.rememberMe = mode;
      Cookies.set(REMEMBER_ME_KEY_, String(mode));
    },
    setPageLoading(loading: boolean): void {
      this.pageLoading = loading;
    },
    setAppTitle(appTitle: string) {
      this.appTitle = appTitle;
    },
    setAppLogo(appLogo: string) {
      this.appLogo = appLogo;
    },

    setDarkMode(mode: ThemeEnum): void {
      this.darkMode = mode;
      localStorage.setItem(APP_DARK_MODE_KEY_, mode);
    },

    setBeforeMiniInfo(state: BeforeMiniState): void {
      this.beforeMiniInfo = state;
    },

    setProjectConfig(config: DeepPartial<ProjectConfig>): void {
      this.projectConfig = deepMerge(this.projectConfig || {}, config);
      Persistent.setLocal(PROJ_CFG_KEY, this.projectConfig);
    },

    async resetAllState() {
      resetRouter();
      Persistent.clearAll();
    },
    async setPageLoadingAction(loading: boolean): Promise<void> {
      if (loading) {
        clearTimeout(timeId);
        // Prevent flicker
        timeId = setTimeout(() => {
          this.setPageLoading(loading);
        }, 50);
      } else {
        this.setPageLoading(loading);
        clearTimeout(timeId);
      }
    },
    async setAppInfoAction() {
      const res = await getAppInfo();
      this.setAppTitle(res.name);
      this.setAppLogo(res.logo);
    },
  },
});

// Need to be used outside the setup
export function useAppStoreWidthOut() {
  return useAppStore(store);
}
