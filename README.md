# flask-pyadmin
pyadmin是一款基于flask和Vue-Vben-Admin的极速后台开发框架。
该框架前端使用Vue-Vben-Admin，后端框架基于flask使用python进行开发。
后台模块(admin)是pyadmin中的核心模块，后台模块又分为权限管理、常规管理和之下的系统配置、附件管理等多个功能模块。
目前已开发的模块如下：
后台模块(admin)
├── admin                  //权限管理模块
│   ├── admin             //管理员管理模块
│   ├── group             //角色组管理模块
│   ├── rule                 //菜单规则管理模块
├── general           	    //常规管理模块
│   ├── config             //系统配置模块
│   ├── attachment     //附件管理模块
目前已完成配合MySql完成数据库接入、基于JWT的登录验证和权限验证、基于蓝图的路由配置等功能。