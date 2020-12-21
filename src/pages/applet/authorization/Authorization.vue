<!--
 * @Description: 小程序管理 / 授权管理.
 * @Author: Leo
 * @Date: 2020-12-17 17:39:10
 * @LastEditTime: 2020-12-21 15:32:41
 * @LastEditors: Leo
-->
<template>
  <div class="authorization-page">
    <a-card class="content-contain"
            :style="`min-height: ${pageMinHeight}px`">
      <!-- search -->
      <h3>已绑定小程序</h3>
      <div class="mb-18 mt-10">
        <a-button @click="addNewAuthor"
                  class="mr-10"
                  type="primary">新增</a-button>
        <a-button>批量操作</a-button>
      </div>
      <!-- table -->
      <standard-table :columns="columns"
                      :dataSource="dataSource"
                      :loading="tableLoading"
                      :pagination="pagination"
                      rowKey="id"
                      @change="handleTableChange">
        <!-- 图标icon -->
        <div slot="appletIcon"
             slot-scope="{text}">
          <img :src="text"
               class="w26 h26"
               alt="logo_icon">
        </div>
        <div slot="action"
             slot-scope="{text, record}">
          <a style="margin-right: 12px"
             @click="chooseAccount(text, record)">选择用户</a>
        </div>
      </standard-table>
    </a-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import StandardTable from "@/components/table/StandardTable";
import { getAuthorTableData } from "@/services/applet";
// table columns data
const columns = [
  {
    title: "图标",
    dataIndex: "appletIcon",
    scopedSlots: { customRender: "appletIcon" },
  },
  {
    title: "小程序名称",
    dataIndex: "appletName",
  },
  {
    title: "关联用户",
    dataIndex: "account",
  },
  {
    title: "管理员账号",
    dataIndex: "adminAccount",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
  },
];

export default {
  name: "Authorization",
  components: { StandardTable },
  i18n: require("./i18n"),
  data() {
    return {
      tableLoading: false,
      columns: columns,
      dataSource: [],
      pagination: {
        pageSize: 10,
        total: 0,
        pageSizeOptions: ["10", "15", "20"],
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条数据`,
      },
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
    // 新增
    addNewAuthor() {
      window.open("http://www.baidu.com");
    },

    // 选择用户
    chooseAccount() {},

    // 列表查询
    searchTableData() {
      // const data = { ...this.form };
      this.tableLoading = true;
      getAuthorTableData().then((res) => {
        const result = res.data;
        if (result.code === 0) {
          this.dataSource = result.data;
          this.pagination.total = result.total;
        }
        this.tableLoading = false;
      });
    },

    handleTableChange(pagination, filters, sorter) {
      console.log(pagination, filters, sorter);
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      // this.pagination = pager;
      // this.fetch({
      //   results: pagination.pageSize,
      //   page: pagination.current,
      //   sortField: sorter.field,
      //   sortOrder: sorter.order,
      //   ...filters
      // });
    },

    // 重置
    reset() {
      this.dataSource = [];
    },
  },
  watch: {
    $route(to) {
      if (to.path.includes("authorization")) {
        this.searchTableData();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.authorization-page {
  h3 {
    border-bottom: 3px solid #fafafa;
    height: 40px;
    line-height: 40px;
    font-size: 18px;
  }
}
</style>