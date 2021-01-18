<!--
 * @Description: 小程序管理 / 代码模板列表.
 * @Author: Leo
 * @Date: 2020-12-17 17:39:10
 * @LastEditTime: 2021-01-18 13:37:22
 * @LastEditors: Leo
-->
<template>
  <div class="codeTemplate-page">
    <a-card class="content-contain"
            :style="`min-height: ${pageMinHeight}px`">
      <div class="mb-18 mt-10">
        <a-button @click="syncCodeTemplate"
                  class="mr-10"
                  type="primary">同步代码模板列表</a-button>
      </div>
      <!-- table -->
      <standard-table :columns="columns"
                      :dataSource="dataSource"
                      :loading="tableLoading"
                      rowKey="templateId">
      </standard-table>
    </a-card>

    <!-- loading -->
    <transition name="el-fade-in">
      <loading ref="loading"></loading>
    </transition>
  </div>
</template>

<script>
import { mapState } from "vuex";
import StandardTable from "@/components/table/StandardTable";
import { getTableData, syncTemplate } from "@/services/codeTemplate";
// table columns data
const columns = [
  {
    title: "添加模板时间",
    dataIndex: "createTime",
  },
  {
    title: "模板ID",
    dataIndex: "templateId",
  },
  {
    title: "模板描述",
    dataIndex: "userDesc",
  },
  {
    title: "模板版本号",
    dataIndex: "userVersion",
  },
];

export default {
  name: "CodeTemplate",
  components: { StandardTable },
  i18n: require("./i18n"),
  data() {
    return {
      tableLoading: false,
      columns: columns,
      dataSource: [],
    };
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
    // page header desc
    desc() {
      return this.$t("description");
    },
  },
  created() {
    this.searchTableData();
  },
  methods: {
    // 同步代码模板列表
    syncCodeTemplate() {
      this.$refs.loading.openLoading("正在同步，请稍后。。");
      syncTemplate()
        .then((res) => {
          this.$refs.loading.closeLoading();
          const result = res.data;
          if (result.code === 0) {
            this.$message.success(result.desc);
            this.searchTableData();
          } else {
            this.$message.error(result.desc);
          }
        })
        .catch(() => {
          this.$refs.loading.closeLoading();
        });
    },

    // 列表查询
    searchTableData() {
      this.tableLoading = true;
      getTableData()
        .then((res) => {
          const result = res.data;
          if (result.code === 0) {
            this.dataSource = result.data;
          } else {
            this.$message.error(result.desc);
          }
          this.tableLoading = false;
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.searchTableData();
    });
  },
};
</script>