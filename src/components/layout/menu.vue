<template>
  <div class="menu ucn-menu" :class="{hideMenu:layout.hideMenu}">
    <div class="fold-box" @click="changeHideMenu">
      <i class="el-icon-arrow-left" v-show="!layout.hideMenu"></i>
      <i class="el-icon-arrow-right" v-show="layout.hideMenu"></i>
    </div>

    <el-menu class="menu-box">
      <el-menu-item-group>
        <el-menu-item index="1-0">
          <router-link to="/">
            <el-tooltip :disabled="!layout.hideMenu" effect="dark" content="前端辅助工具" placement="right">
              <i class="el-icon-menu"></i>
            </el-tooltip>
            <span>前端辅助工具</span>
          </router-link>
        </el-menu-item>
        <el-menu-item index="1-1">
          <router-link to="/auth">
            <el-tooltip :disabled="!layout.hideMenu" effect="dark" content="设置功能权限树" placement="right">
              <i class="el-icon-setting"></i>
            </el-tooltip>
            <span>设置功能权限树</span>
          </router-link>
        </el-menu-item>
      </el-menu-item-group>
    </el-menu>

  </div>
</template>

<script>
  import {mapActions, mapState} from 'vuex';
  import {routerMap} from 'service/router'

  export default {
    name: 'VMenu',
    data() {
      return {
        routerList: [],
        activeName: null,
        activeOpen: [],
      }
    },
    computed: {
      ...mapState({
        quickLink: state => state.quickLink,
        layout: state => state.layout,
        menuLink: state => state.menuLink
      }),
    },
    mounted() {
      routerMap.forEach(value => {
        // 判断路由是否显示
        if (!value.hidden) {
          this.routerList.push(value)
        }
      });

      // this.updateMenuActive();
    },
    watch: {
      $route() {
        // this.updateMenuActive();
      }
    },
    methods: {
      updateMenuActive() {
        this.activeOpen = [];
        this.activeName = '';
        _.map(this.routerList, (val, index) => {
          if (val.name === this.$route.matched[0].name) {
            this.activeOpen.push(index.toString());
            _.map(val.children, (cVal, cIndex) => {
              if (this.$route.name === cVal.name || this.$route.path === cVal.redirect) {
                this.activeName = `${index}-${cIndex}`;
              }
            });
            if (!this.activeName) {
              _.map(val.children, (cVal, cIndex) => {
                if (this.$route.matched[1].name === cVal.name) {
                  this.activeName = `${index}-${cIndex}`;
                }
              });
            }
          }
        });
      },
      checkAuth(param) {
        let user = this.$localStore.get('user') || {userType: 1};

        if (_.isEmpty(param)) {
          return true;
        }

        return _.indexOf(param, user.userType) !== -1;
      },
      changeHideMenu() {
        this.layout.hideMenu = !this.layout.hideMenu;
        this.$userAction.set('hideMenu', this.layout.hideMenu);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "../../assets/style/base.less";

  .ucn-menu {
    position: fixed;
    height: 100%;
    top: 0;
    left: 0;
    background-color: @menu-back;
    z-index: 910;
    transform: translate(0, 0);
    transition: all .4s;
  }

  .ucn-menu .menu-box {
    width: 180px;
    height: 100%;
    overflow: auto;
  }

  .ucn-menu .ivu-menu {
    background-color: @menu-back;
    transition: all .3s;
  }

  .ucn-menu .ivu-menu-item {
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ivu-menu-dark {
    background-color: #333333;
  }

  .fold-box {
    position: absolute;
    right: 0;
    top: 40%;
    z-index: 911;
    height: 60px;
    background-color: #3f3f3f;
    width: 20px;
    cursor: pointer;
    line-height: 60px;
    text-align: center;
    border-bottom-right-radius: 5px;
    border-top-right-radius: 5px;
    transition: all .5s;
    opacity: 0;
    transform: translate(0, 0);
  }

  .el-menu {
    border: none;
    background-color: inherit;
  }

  .el-menu-item,
  .el-menu-item a,
  .el-menu-item i {
    line-height: 34px;
    height: 36px;
    font-size: 12px;
    color: #FFFFFF;
    overflow: hidden;
    display: block;
    /*text-overflow: ellipsis;*/
    /*white-space: nowrap;*/
    /*background-color: inherit !important;*/
  }

  .el-menu-item i {
    width: 20px;
    font-size: 16px;
    text-align: center;
    display: inline-block;
  }

  .ucn-menu.hideMenu .fold-box,
  .ucn-menu:hover .fold-box {
    transform: translate(20px);
    opacity: 1;
  }

  .fold-box i {
    color: rgba(255, 255, 255, .7);;
    font-size: 18px;
    margin-left: -2px;
    margin-top: 2px;
  }

  .fold-box:hover i {
    color: #FFFFFF;
  }

  .ucn-menu.hideMenu {
    transform: translate(-130px, 0);
  }

  .ucn-menu.hideMenu .el-menu-item-group__title i,
  .ucn-menu.hideMenu .el-menu-item i {
    font-size: 20px;
    margin-right: 0;
    padding-right: 15px;
  }

  .ucn-menu.hideMenu .el-menu-item {
    padding-right: 0;
  }

  .ucn-menu.hideMenu .el-menu-item-group__title span,
  .ucn-menu.hideMenu .el-menu-item span {
    display: none;
  }

  .ucn-menu.hideMenu .el-menu-item-group__title > div,
  .ucn-menu.hideMenu .el-menu-item {
    text-align: right;
  }

  .el-menu-item:hover,
  .el-menu-item:focus {
    background-color: rgba(119, 119, 119, .5);
  }

  .ucn-menu /deep/ .el-menu-item [class^="el-icon-"] {
    margin-right: 0;
  }
</style>
