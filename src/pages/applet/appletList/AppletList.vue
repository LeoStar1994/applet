<!--
 * @Description: 小程序管理 / 小程序列表.
 * @Author: Leo
 * @Date: 2020-12-17 17:39:10
 * @LastEditTime: 2021-01-20 17:48:24
 * @LastEditors: Leo
-->
<template>
  <div class="appletList-page">
    <a-card class="content-contain"
            :style="`min-height: ${pageMinHeight}px`">
      <h3>已绑定小程序</h3>
      <div class="mb-18 mt-10">
        <a-button @click="addApplet"
                  class="mr-10"
                  type="primary">新增</a-button>
      </div>
      <!-- table -->
      <standard-table :columns="columns"
                      :dataSource="dataSource"
                      :loading="tableLoading"
                      rowKey="appid">
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
               class="w26 h26 cursor-pointer"
               @click="viewQRCode(text)"
               alt="二维码">
        </div>
        <div slot="action"
             slot-scope="{record}">
          <a-button class="mr-12 mb-6"
                    type="primary"
                    size="small"
                    @click="updateAppletInfo(record.appid)">更新基本信息</a-button>
          <a-button class="mr-12 mb-6"
                    type="primary"
                    size="small"
                    @click="openAuthorList(record.appid)">权限集列表</a-button>
          <a-button class="mr-12 mb-6"
                    type="danger"
                    size="small"
                    @click="unbind(record.appid)">解绑</a-button>
        </div>
      </standard-table>
    </a-card>

    <!-- 二维码弹框放大 -->
    <QRCode ref="QRCodeModal"
            :title="QRTitle"
            :QRCodeUrl="QRCodeUrl"></QRCode>

    <!-- 权限集列表 -->
    <RolesList ref="rolesList"
               :appletRolesList="appletRolesList"></RolesList>
    <!-- loading -->
    <transition name="el-fade-in">
      <loading ref="loading"></loading>
    </transition>
  </div>
</template>

<script>
import { mapState } from "vuex";
import StandardTable from "@/components/table/StandardTable";
import QRCode from "@/components/qrcode/QRCode";
import RolesList from "./RolesList";
import {
  getTableData,
  appletRoles,
  appletAuthPage,
  appletUnbind,
} from "@/services/appletList";
// table columns data
const columns = [
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
    title: "功能介绍",
    dataIndex: "signature",
  },
  {
    title: "小程序二维码",
    dataIndex: "qrcodeUrl",
    scopedSlots: { customRender: "qrcode" },
  },
  {
    title: "主体名称",
    dataIndex: "principalName",
  },
  {
    title: "服务类目",
    dataIndex: "categories",
  },
  {
    title: "授权时间",
    dataIndex: "authorizerTime",
  },
  {
    title: "操作",
    width: "200px",
    scopedSlots: { customRender: "action" },
  },
];

export default {
  name: "AppletList",
  components: { StandardTable, QRCode, RolesList },
  i18n: require("./i18n"),
  data() {
    return {
      tableLoading: false,
      columns: columns,
      QRTitle: "查看二维码",
      QRCodeUrl: "",
      dataSource: [],
      appletRolesList: [],
      timer: null,
      rtn: null,
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
    addApplet() {
      appletAuthPage().then((res) => {
        const result = res.data;
        if (result.code === 0) {
          this.rtn = window.open(result.data.authPageUrl);
          this.timer = setInterval(this.checkPageClose, 1000);
        } else {
          this.$message.error(result.desc);
        }
      });
    },

    checkPageClose() {
      if (this.rtn != null && this.rtn.closed) {
        clearInterval(this.timer);
        this.timer = null;
        this.rtn = null;
        this.searchTableData();
      }
    },

    // 查看二维码
    viewQRCode(QRCodeUrl) {
      this.QRCodeUrl = QRCodeUrl;
      this.$refs.QRCodeModal.openQRCode();
    },

    // 更新基本信息
    updateAppletInfo(appid) {
      this.$refs.loading.openLoading("数据更新中，请稍后。。");
      appletRoles({ appid })
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

    // 权限集列表
    openAuthorList(appid) {
      this.$refs.loading.openLoading("数据查询中，请稍后。。");
      appletRoles({ appid })
        .then((res) => {
          this.$refs.loading.closeLoading();
          const result = res.data;
          if (result.code === 0) {
            this.appletRolesList = result.data;
            this.$refs.rolesList.setOpenType();
          } else {
            this.$message.error(result.desc);
          }
        })
        .catch(() => {
          this.$refs.loading.closeLoading();
        });
    },

    // 解绑
    unbind(appid) {
      const data = this.$qs.stringify({ appid });
      this.$refs.loading.openLoading("操作进行中，请稍后。。");
      appletUnbind(data)
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
      getTableData().then((res) => {
        const result = res.data;
        if (result.code === 0) {
          this.dataSource = result.data.records;
        } else {
          this.$message.error(result.desc);
        }
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