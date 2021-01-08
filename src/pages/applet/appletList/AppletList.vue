<!--
 * @Description: 小程序管理 / 小程序列表管理.
 * @Author: Leo
 * @Date: 2020-12-17 17:39:10
 * @LastEditTime: 2021-01-08 17:00:03
 * @LastEditors: Leo
-->
<template>
  <div class="appletList-page">
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
               alt="图标">
        </div>
        <!-- 二维码 -->
        <div slot="qrcode"
             slot-scope="{text}">
          <img :src="text"
               class="w26 h26"
               alt="二维码">
        </div>
        <div slot="action"
             slot-scope="{record}">
          <a style="margin-right: 12px"
             @click="chooseAccount(record)">选择用户</a>
        </div>
      </standard-table>
    </a-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import StandardTable from "@/components/table/StandardTable";
import { getTableData } from "@/services/appletList";
// table columns data
const columns = [
  {
    title: "APPID",
    dataIndex: "appid",
  },
  {
    title: "图标",
    dataIndex: "headImg",
    scopedSlots: { customRender: "appletIcon" },
  },
  {
    title: "小程序名称",
    dataIndex: "nickName",
  },
  {
    title: "主体名称",
    dataIndex: "principalName",
  },
  {
    title: "小程序二维码",
    dataIndex: "qrcodeUrl",
    scopedSlots: { customRender: "qrcode" },
  },
  {
    title: "功能介绍",
    dataIndex: "signature",
  },
  {
    title: "用户",
    dataIndex: "userName",
  },
  {
    title: "账号",
    dataIndex: "userAccount",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
  },
];

export default {
  name: "AppletList",
  components: { StandardTable },
  i18n: require("./i18n"),
  data() {
    return {
      tableLoading: false,
      columns: columns,
      dataSource: [],
      pagination: {
        pageSize: 10,
        pageNo: 1,
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
    // this.searchTableData();
  },
  methods: {
    // 新增
    addNewAuthor() {
      window.open("http://www.baidu.com");
    },

    // 选择用户
    chooseAccount(rowData) {
      console.log(rowData);
      // const data = {
      //   appid: rowData.appid,
      //   userIdentify: rowData.userIdentify,
      // };
      // commitBinding(data).then((res) => {
      //   const result = res.data;
      //   if (result.code === 0) {
      //     console.log(result);
      //   } else {
      //     this.$message.error(result.desc);
      //   }
      // });
    },

    // 列表查询
    searchTableData() {
      const data = {
        pageNo: this.pagination.pageNo,
        pageSize: this.pagination.pageSize,
      };
      this.tableLoading = true;
      getTableData(data).then((res) => {
        const result = res.data;
        if (result.code === 0) {
          this.dataSource = result.data;
          this.pagination.total = result.total;
        } else {
          this.$message.error(result.desc);
        }
        this.tableLoading = false;
      });
    },

    handleTableChange(pagination) {
      let { current, pageSize } = pagination;
      this.pagination.pageSize = pageSize;
      this.pagination.pageNo = current;
      this.searchTableData();
    },

    // 重置
    reset() {
      this.dataSource = [];
    },
  },
  watch: {
    // $route(to) {
    //   if (to.path.includes("binding")) {
    //     this.searchTableData();
    //   }
    // },
  },
};
</script>

<style lang="less" scoped>
.appletList-page {
  h3 {
    border-bottom: 3px solid #fafafa;
    height: 40px;
    line-height: 40px;
    font-size: 18px;
  }
}
</style>