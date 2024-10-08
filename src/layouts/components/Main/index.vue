<template>
  <el-container>
    <el-main>
      <router-view slot-scope="{ component }">
        <transition appear name="fade-transform" mode="out-in">
          <keep-alive :include="keepAliveName">
            <component :is="createComponentWrapper(component)" v-if="isRouterShow" :key="$route.fullPath" />
          </keep-alive>
        </transition>
      </router-view>
    </el-main>
    <el-footer v-show="footer">
      <Footer />
    </el-footer>
  </el-container>
</template>

<script>
import Footer from "@/layouts/components/Footer/index.vue"
import {mapGetters} from "vuex";
export default {
  name: "Main-page",
  components: {
    Footer,
  },
  computed:{
    ...mapGetters({
        layout: 'global/getLayout',
    }),
  },
  watch: {
    layout: {
      handler(val) {
        const body = document.body;
        body.setAttribute('class', val);
      },
      immediate: true
    }
  },
  data(){
    return {
      footer: true,
      wrapperMap: new Map(),
      isRouterShow: true, // 控制是否显示路由组件
      keepAliveName: []   // 需要缓存的组件名
    }
  },
  created() {
    this.$store.dispatch("global/updateGlobalState",{ layout:'classic' });
  },
  methods:{
    createComponentWrapper(component) {
      const wrapperName = this.$route.fullPath;
      let wrapper = this.wrapperMap.get(wrapperName);

      // 解决详情页 keep-alive 问题
      if (!component) return;

      if (!wrapper) {
        wrapper = {
          name: wrapperName,
          render: function(createElement) {
            return createElement(component)
          }
        }
        this.wrapperMap.set(wrapperName, wrapper)
      }

      return this.$options.components[wrapperName] || wrapper
    }
  }
}
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>