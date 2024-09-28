<template>
  <div class="sub-menu">
    <!-- 循环菜单项 -->
    <template v-for="subItem in menuList">
      <el-submenu v-if="subItem.children?.length" :index="subItem.path" :key="subItem.path">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span slot="title" class="sle">{{ subItem.meta.title }}</span>
        </template>
        <SubMenu :menu-list="subItem.children"/>
      </el-submenu>
      <el-menu-item v-else :index="subItem.path" :key="subItem.path" @click="handleClickMenu(subItem)">
        <i class="el-icon-menu"></i>
        <template slot="title">
          <span slot="title">{{ subItem.meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
  </div>
</template>

<script>
export default {
  name: "SubMenu",
  props: {
    menuList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {}
  },
  methods: {
    handleClickMenu(subItem) {
      // Get the current route path
      const currentPath = this.$route.path;
      // 点击菜单项的处理逻辑
      if (subItem.meta.isLink) {
        window.open(subItem.meta.isLink, "_blank");
      } else if (currentPath !== subItem.path) {
        this.$router.push(subItem.path);
      }
    }
  }
}
</script>

<style lang="scss">
.el-sub-menu .el-sub-menu__title:hover {
  color: var(--el-menu-hover-text-color) !important;
  background-color: transparent !important;
}
.el-menu--collapse {
  .is-active {
    .el-sub-menu__title {
      color: #ffffff !important;
      background-color: var(--el-color-primary) !important;
    }
  }
}
.el-menu-item {
  &:hover {
    color: var(--el-menu-hover-text-color);
  }
  &.is-active {
    color: var(--el-menu-active-color) !important;
    background-color: var(--el-menu-active-bg-color) !important;
    &::before {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 4px;
      content: "";
      background-color: var(--el-color-primary);
    }
  }
}
.vertical,
.classic,
.transverse {
  .el-menu-item {
    &.is-active {
      &::before {
        left: 0;
      }
    }
  }
}
.columns {
  .el-menu-item {
    &.is-active {
      &::before {
        right: 0;
      }
    }
  }
}
</style>
