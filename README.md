# flask-pyadmin
## 简介
pyadmin是一款基于Flask和Vue-Vben-Admin的极速后台开发框架。

## 主要特性
* 该框架前端使用Vue-Vben-Admin，后端框架基于flask使用python进行开发。
* 该框架前端相关内容位于根目录下的antd文件夹内，该文件夹内文件结构为Vue-Vben-Admin
  框架的标准结构。
* 后台模块(admin)是pyadmin中的核心模块，目前已开发的模块如下：

* admin _后台模块_
 * admin    _权限管理模块_
   * admin  _管理员管理模块_
   * group  _角色组管理模块_
   * rule   _菜单规则管理模块_
 * general  _常规管理模块_
   * config _系统配置模块_
   * attachment _附件管理模块_
 * member _会员模块_
   * unit _单位管理模块_
   * person _个人管理模块_
   * user _会员管理模块_
   * check _审核管理模块_
 
* 目前已完成配合MySql完成数据库接入、基于JWT的登录验证和权限验证、基于蓝图的路由配置等功能。

## 准备
* Python - 熟悉 Python 使用
* Vite - 熟悉 vite 特性
* Vue3 - 熟悉 Vue 基础语法
* TypeScript - 熟悉TypeScript基本语法
* Es6+ - 熟悉 es6 基本语法
* Vue-Router-Next - 熟悉 vue-router 基本使用
* Ant-Design-Vue - ui 基本使用
* Mock.js - mockjs 基本语法

## 安装使用

- 获取项目代码

```bash
git clone https://github.com/superbee315/flask-pyadmin.git

```

## 项目地址

[flask-pyadmin](https://github.com/superbee315/flask-pyadmin) 

## 维护者

[@李嘉](https://github.com/superbee315)


## 特别鸣谢

感谢以下的项目,排名不分先后

Flask：https://flask.palletsprojects.com/

Vue-Vben-Admin：https://gitee.com/freemo/vue-vben-admin
