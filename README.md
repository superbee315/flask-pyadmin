# flask-pyadmin
pyadmin是一款基于Flask和Vue-Vben-Admin的极速后台开发框架。

## 主要特性
* 该框架前端使用Vue-Vben-Admin，后端框架基于flask使用python进行开发。
* 后台模块(admin)是pyadmin中的核心模块，目前已开发的模块如下：

* admin _后台模块_
 * admin    _权限管理模块_
   * admin  _管理员管理模块_
   * group  _角色组管理模块_
   * rule   _菜单规则管理模块_
 * general  _常规管理模块_
   * config _系统配置模块_
   * attachment _附件管理模块_

* 目前已完成配合MySql完成数据库接入、基于JWT的登录验证和权限验证、基于蓝图的路由配置等功能。

## 特别鸣谢

感谢以下的项目,排名不分先后

Flask：https://flask.palletsprojects.com/

Vue-Vben-Admin：https://gitee.com/freemo/vue-vben-admin
