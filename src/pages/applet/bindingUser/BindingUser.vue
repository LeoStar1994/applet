<!--
 * @Description: 小程序管理 / 绑定用户.
 * @Author: Leo
 * @Date: 2020-12-17 17:39:10
 * @LastEditTime: 2021-01-18 17:58:30
 * @LastEditors: Leo
-->
<template>
  <div class="bindingUser-page">
    <a-card class="content-contain"
            :style="`min-height: ${pageMinHeight}px`">
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
          <a-button class="mr-12"
                    type="primary"
                    size="small"
                    :disabled="!record.isShowButtonBindUser"
                    @click="chooseAccount(record.appid)">选择用户</a-button>
        </div>
      </standard-table>
    </a-card>

    <!-- 二维码弹框放大 -->
    <QRCode ref="QRCodeModal"
            :title="QRTitle"
            :QRCodeUrl="QRCodeUrl"></QRCode>

    <!-- 选择用户弹框 -->
    <ChooseUser ref="chooseUser"
                :userIdentifyList="userIdentifyList"
                @refreshTableData="searchTableData"></ChooseUser>
  </div>
</template>

<script>
import { mapState } from "vuex";
import StandardTable from "@/components/table/StandardTable";
import QRCode from "@/components/qrcode/QRCode";
import ChooseUser from "./ChooseUser";
import { getTableData, initData } from "@/services/bindingUser";
// table columns data
const columns = [
  // {
  //   title: "APPID",
  //   dataIndex: "appid",
  // },
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
  name: "bindingUser",
  components: { StandardTable, QRCode, ChooseUser },
  i18n: require("./i18n"),
  data() {
    return {
      tableLoading: false,
      columns: columns,
      dataSource: [],
      userIdentifyList: [],
      QRTitle: "查看二维码",
      QRCodeUrl: "",
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
    this.getInitData();
  },
  methods: {
    // 新增
    getInitData() {
      initData().then((res) => {
        const result = res.data;
        if (result.code === 0) {
          this.userIdentifyList = result.data.bssUserModel;
          this.dataSource = result.data.ipage.records;
        } else {
          this.$message.error(result.desc);
        }
      });
    },

    // 查看二维码
    viewQRCode(QRCodeUrl) {
      this.QRCodeUrl = QRCodeUrl;
      this.$refs.QRCodeModal.openQRCode();
    },

    // 选择用户
    chooseAccount(appid) {
      this.$refs.chooseUser.setOpenType(appid);
    },

    // 列表查询
    searchTableData() {
      this.tableLoading = true;
      getTableData()
        .then((res) => {
          const result = res.data;
          if (result.code === 0) {
            this.dataSource = result.data.records;
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
