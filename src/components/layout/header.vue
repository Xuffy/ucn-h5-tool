<template>
  <div class="header-box ucn-header">
    <div class="header">
    </div>
  </div>
</template>

<script>
  import {routerMap} from 'service/router'

  export default {
    name: 'VHeader',
    data() {
      return {
      }
    },
    watch: {
    },
    created() {
    },
    methods: {
    },
  }
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import '../../assets/style/base.less';

  .header-box {
    height: 60px;
    position: fixed;
    width: 100%;
    z-index: 999;
    overflow: hidden;
  }

  .ucn-header .link {
    width: 100%;
    height: 100%;
    display: block !important;
  }

  .header {
    height: 100%;
    background-color: @header-back;
  }

  .logo {
    margin-left: 20px;
    margin-right: 40px;
    cursor: pointer;
    vertical-align: middle;
    transition: all .5s;
  }

  .logo-icon {
    margin-right: 15px;
  }

  .title {
    font-size: 24px;
    color: #ffffff;
    font-weight: 400;
    cursor: pointer;
  }

  .ivu-dropdown-rel a {
    color: #ffffff;
    font-size: 14px;
  }

  .ivu-dropdown {
    margin-left: 30px;
  }

  .ivu-dropdown-menu {
    text-align: left;
  }

  .ucn-header-menu {
    display: inline-block;
    line-height: 70px;
    vertical-align: middle;
  }

  .ucn-header-menu .ivu-menu {
    background: none;
  }

  .header-right {
    position: absolute;
    right: 20px;
    top: 0;
    background-color: #3f3f3f;
    padding-left: 10px;
  }

  .user-box {
    vertical-align: middle;
    display: inline-block;
  }

  .user-box a {
    transition: all .5s;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 80px;
    display: inline-block;
    vertical-align: middle;
  }

  .user-box a:hover {
    color: #eeeeee;
  }

  .el-menu--horizontal {
    border: none;
  }

  .el-menu--horizontal {
    background-color: initial;
  }

  .el-submenu,
  .el-menu-item {
    padding: 0 34px 0 0;
    border: none !important;
    transition: all .5s;
  }

  .el-menu-item:hover,
  .el-menu--horizontal > .el-menu-item.is-active,
  .el-menu--horizontal .el-menu-item:not(.is-disabled):focus,
  .el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
    background-color: inherit;
    color: #FFFFFF !important;
    /*background-color: rgba(119, 119, 119, .5);*/
  }

  /*.el-menu-item:hover,
  .el-menu--horizontal > .el-menu-item.is-active,
  .el-menu--horizontal .el-menu-item:focus,
  .el-menu--horizontal .el-menu-item:hover,
  .el-menu--horizontal .el-submenu:focus,
  .el-menu--horizontal .el-submenu:hover {
    background-color: rgba(119, 119, 119, .5);
  }*/

  .message-box {
    position: relative;
    display: inline-block;
    line-height: 20px;
    cursor: pointer;
    margin-right: 10px;
  }

  .message-box i {
    font-size: 20px;
    color: #eeeeee;
  }

  .message-popover .ucn-content-title {
    font-size: 14px;
    width: 100%;
    padding: 15px 10px 10px 10px;
    box-sizing: border-box;
  }

  .message-popover .list {
    width: 100%;
    max-height: 300px;
    overflow: auto;
    border-top: 1px solid #eeeeee;
    border-bottom: 1px solid #eeeeee;
  }

  .message-popover .list li {
    padding: 10px 10px 10px 20px;
    cursor: pointer;
    position: relative;
    border-bottom: 1px solid #eeeeee;
  }

  .message-popover .list li.unread:before {
    content: '';
    width: 8px;
    height: 8px;
    top: 50%;
    left: 5px;
    margin-top: -4px;
    border-radius: 50%;
    background-color: #f56c6c;
    position: absolute;
  }

  .message-popover .list li:last-child {
    border-bottom: none;
  }

  .message-popover .list li:hover {
    background-color: #F7F4F4;
  }

  .message-popover .list li span {
    display: block;
    width: 100%;
    text-align: right;
    color: #CDCDCD;
  }

  .icon-menu {
    vertical-align: middle;
    display: inline-block;
  }

  .icon-menu i {
    font-size: 20px;
    color: #eeeeee;
    margin-right: 10px;
    cursor: pointer;
  }
</style>
<style>
  .message-popover {
    padding: 0;
  }

  .ucn-header-submenu a {
    width: 100%;
    height: 100%;
    display: block !important;
  }

  .ucn-header .router-link-active {
    color: #FFFFFF !important;
  }

  .ucn-header-submenu.is-active,
  .ucn-header-submenu:hover {
    background-color: #f5f7fa !important;
  }

  .ucn-header-menu .el-menu--horizontal > .el-submenu .el-submenu__title:hover {
    background-color: inherit !important;
    color: #FFFFFF !important;
  }

  .ucn-header-menu .el-menu--horizontal > .el-submenu .el-submenu__title {
    color: #909399;
    font-size: 12px;
    padding: 0;
    padding-right: 5px;
    border: none;
    line-height: 58px;
  }

  .ucn-header-menu .el-menu--horizontal > .el-menu-item a {
    font-size: 12px;
    display: inline;
  }

  .ucn-header-menu .el-menu--horizontal > .el-submenu.is-active .el-submenu__title,
  .ucn-header-menu .el-menu--horizontal > .el-menu-item.is-active {
    border-bottom: none;
  }

  .ucn-header-menu .is-active .el-submenu__title span {
    color: #ffffff;
  }

  .ucn-header .el-menu--horizontal > .el-submenu .el-submenu__icon-arrow {
    display: inline;
  }

  .ucn-header .el-menu--horizontal > .el-submenu:focus .el-submenu__title,
  .ucn-header .el-menu--horizontal > .el-submenu:hover .el-submenu__title {
    color: #909399;
  }

  .ucn-language-zh .ucn-header .el-submenu,
  .ucn-language-zh .ucn-header .el-menu-item {
    padding: 0 55px 0 0;
  }

  .ucn-language-zh .ucn-header .el-submenu span,
  .ucn-language-zh .ucn-header .el-menu-item a {
    font-size: 14px;
  }

</style>
