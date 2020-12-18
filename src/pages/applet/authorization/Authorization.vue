<!--
 * @Description: 小程序管理 / 授权管理.
 * @Author: Leo
 * @Date: 2020-12-17 17:39:10
 * @LastEditTime: 2020-12-17 19:24:10
 * @LastEditors: Leo
-->
<template>
  <div class="content-contain"
       :style="`min-height: ${pageMinHeight}px`">
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Authorization",
  i18n: require("./i18n"),
  data() {
    return {};
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
    // page header desc
    desc() {
      return this.$t("description");
    },
  },
};
</script>

<style scoped lang="less">
</style>