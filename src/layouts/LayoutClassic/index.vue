<!-- 基本布局 -->
<template>
  <el-container class="layout">
    <!-- 网页头部 -->
    <el-header>
      <div class="header-lf mask-image">
        <div class="logo flx-center">
          <img class="logo-img" :src="logoSrc" alt="logo" />
          <span class="logo-text">{{ title }}</span>
        </div>
<!--        <ToolBarLeft />-->
      </div>
      <div class="header-ri">
<!--        <ToolBarRight />-->
      </div>
    </el-header>

    <el-container class="classic-content">
      <!-- 左侧导航 -->
      <el-aside>
        <div class="aside-box" :style="{ width: isCollapse ? '65px' : '210px' }">
          <el-scrollbar>
            <el-menu
                :router="false"
                :default-active="activeMenu"
                :collapse="isCollapse"
                :unique-opened="accordion"
                :collapse-transition="false">
              <SubMenu :menu-list="menuList" />
            </el-menu>
          </el-scrollbar>
        </div>
      </el-aside>
      <!-- 内容区域 -->
      <el-container class="classic-main">
        <Main />
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import Main from '@/layouts/components/Main/index.vue'
import SubMenu from '@/layouts/components/Menu/SubMenu.vue'
// import ToolBarLeft from '@/layouts/components/Header/ToolBarLeft.vue'
// import ToolBarRight from '@/layouts/components/Header/ToolBarRight.vue'

export default {
  name: 'LayoutClassic',
  components: {
    Main,
    SubMenu,
    // ToolBarLeft,
    // ToolBarRight,
  },
  computed: {
    ...mapGetters({
        // accordion: 'global/accordion',
        // isCollapse: 'global/isCollapse',
        menuList: 'auth/authMenuListGet',
    }),

    title() {
      return process.env.VUE_APP_TITLE;
    },

    activeMenu() {
      const route = this.$route;
      return route.meta.activeMenu || route.path;
    },

    logoSrc() {
      return require('@/assets/images/logo.svg');
    },
  },
  created() {},
  data(){
    return {
      isCollapse: false,
      accordion: false
    }
  }
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
