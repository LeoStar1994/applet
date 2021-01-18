<!--
 * @Description: 小程序管理 / 版本控制.
 * @Author: Leo
 * @Date: 2020-12-17 17:39:10
 * @LastEditTime: 2021-01-18 23:11:35
 * @LastEditors: Leo
-->
<template>
  <div class="version-page">
    <a-card class="content-contain"
            :style="`min-height: ${pageMinHeight}px`">
      <!-- table -->
      <standard-table :columns="columns"
                      :dataSource="dataSource"
                      :loading="tableLoading"
                      :scroll="{x: 1400}"
                      rowKey="appid">
        <div slot="appletIcon"
             slot-scope="{text}">
          <img :src="text"
               width="30px"
               alt="">
        </div>
        <div slot="auditResult"
             slot-scope="{text, record}">
          <span v-if="text === 1"
                class="text-red">
            审核失败
            <a href="#"
               class="d-block"
               @click="viewFileReason(record.appid)">【查看失败原因】</a>
          </span>
          <span v-else
                :class="[text === 0 ? 'text-green': '',(text === 2 || text === 3 ) ? 'text-orange': '', text === 4 ? 'text-blue': '']">
            {{auditResultMapText[text]}}
          </span>
        </div>
        <!-- 操作 -->
        <div slot="action"
             slot-scope="{record}">
          <a-button class="mr-12 mb-6"
                    type="primary"
                    size="small"
                    @click="openCodeUpload(record.appid)">上传代码
          </a-button>
          <!-- 提交审核 -->
          <a-popconfirm :title="`当前上传版本号：${record.testerUserVersion}，是否提交审核?`"
                        ok-text="确定"
                        cancel-text="取消"
                        class="mr-12 mb-6"
                        :disabled="!record.isShowButtonSubmitAudit"
                        @confirm="submitAudit(record.appid)"
                        @cancel="cancel">
            <a-button type="primary"
                      :disabled="!record.isShowButtonSubmitAudit"
                      size="small">提交审核</a-button>
          </a-popconfirm>
          <!-- 审核撤回 -->
          <a-popconfirm ok-text="确定"
                        cancel-text="取消"
                        class="mr-12 mb-6"
                        :disabled="!record.isShowButtonUndocodeAudit"
                        @confirm="undocodeAudit(record.appid)"
                        @cancel="cancel">
            <template slot="title">
              <p>是否撤回当前正在审核中的代码？</p>
              <p>注：单个帐号每天审核撤回次数最多不超过5次（每天的额度从0点开始生效），一个月不超过10次</p>
            </template>
            <a-button :class="[record.isShowButtonUndocodeAudit ? 'orangeButton' : '']"
                      :disabled="!record.isShowButtonUndocodeAudit"
                      size="small">审核撤回</a-button>
          </a-popconfirm>
          <!-- 通知发布 -->
          <a-popconfirm ok-text="确定"
                        cancel-text="取消"
                        class="mr-12 mb-6"
                        :disabled="!record.isShowButtonMsgUpdate"
                        @confirm="noticeIssue(record.appid)"
                        @cancel="cancel">
            <template slot="title">
              <p>通知业务系统更新小程序，</p>
              <p>业务系统同意后将发布已通过审核的小程序</p>
            </template>
            <a-button type="primary"
                      :disabled="!record.isShowButtonMsgUpdate"
                      size="small">通知发布</a-button>
          </a-popconfirm>
          <a-popconfirm ok-text="确定"
                        cancel-text="取消"
                        class="mr-12 mb-6"
                        :disabled="!record.isShowButtonVersionRollback"
                        @confirm="backLastVersion(record.appid)"
                        @cancel="cancel">
            <template slot="title">
              <p>如果没有上一个线上版本，将无法回退。</p>
              <p>只能向上回退一个版本，即当前版本回退后，不能再调用版本回退接口</p>
            </template>
            <a-button size="small"
                      :disabled="!record.isShowButtonVersionRollback"
                      type="danger">版本回退</a-button>
          </a-popconfirm>
        </div>
        <!-- 体验者操作 -->
        <div slot="experienceAction"
             slot-scope="{record}">
          <a-button class="mr-12 mb-6"
                    size="small"
                    type="primary"
                    @click="fetchExperienceQRCode(record.appid)">获取体验版二维码
          </a-button>
          <a-button class="mr-12 mb-6"
                    size="small"
                    type="primary"
                    @click="testerOperate(record.appid, 0)">绑定体验者</a-button>
          <a-button class="mr-12 mb-6"
                    size="small"
                    type="primary"
                    @click="testerOperate(record.appid, 1)">解除体验者</a-button>
        </div>
      </standard-table>
    </a-card>

    <!-- 上传代码modal -->
    <CodeUploadModal ref="codeUploadModal"
                     :codeTemplateList="codeTemplateList"
                     @searchTableData="searchTableData"></CodeUploadModal>

    <!-- 体验二维码modal -->
    <QRCode ref="QRCodeModal"
            :title="QRTitle"
            :QRCodeUrl="QRCodeUrl"></QRCode>

    <!-- 查看失败原因 -->
    <ViewFailReason ref="failReason"
                    :title="failReasonTitle"
                    :failReasonImgList="failReasonImgList"
                    :failReason="failReason"></ViewFailReason>

    <!-- 绑定、解绑体验者modal -->
    <AuditWechat ref="auditWechat"
                 :title="testerTitle"></AuditWechat>

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
import CodeUploadModal from "./CodeUploadModal";
import ViewFailReason from "./ViewFailReason";
import AuditWechat from "./AuditWechat";
import {
  getTableData,
  getCodeTemplateList,
  backVersion,
  submitAudit,
  noticeIssueInfo,
  backAudit,
  getQrcode,
  failReason,
} from "@/services/version";
// table columns data
const columns = [
  {
    title: "图标",
    dataIndex: "headImg",
    scopedSlots: { customRender: "appletIcon" },
    width: "100px",
  },
  {
    title: "小程序名称",
    dataIndex: "nickName",
    width: "120px",
  },
  {
    title: "上一个版本",
    dataIndex: "lastUserVersion",
    width: "120px",
  },
  {
    title: "当前版本号",
    dataIndex: "nowUserVersion",
    width: "120px",
  },
  {
    title: "体验版",
    dataIndex: "testerUserVersion",
    width: "120px",
  },
  {
    title: "审核中版本",
    dataIndex: "submitAuditUserVersion",
    width: "120px",
  },
  {
    title: "审核结果",
    dataIndex: "auditState",
    scopedSlots: { customRender: "auditResult" },
    width: "120px",
  },
  {
    title: "通知更新状态",
    dataIndex: "msgUpdateState",
    width: "120px",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    width: "200px",
  },
  {
    title: "体验者操作",
    scopedSlots: { customRender: "experienceAction" },
    width: "200px",
  },
];

export default {
  name: "Version",
  components: {
    StandardTable,
    CodeUploadModal,
    QRCode,
    ViewFailReason,
    AuditWechat,
  },
  i18n: require("./i18n"),
  data() {
    return {
      QRTitle: "体验二维码",
      failReasonTitle: "查看失败原因",
      testerTitle: "绑定体验者",
      failReason: "",
      failReasonImgList: [],
      tableLoading: false,
      columns: columns,
      confirmLoading: false,
      dataSource: [],
      labelCol: { span: 4 },
      wrapperCol: { span: 14, offset: 1 },
      auditResultMapText: {
        0: "审核成功",
        1: "审核被拒绝",
        2: "审核中",
        3: "已撤回",
        4: "审核延后",
      },
      codeTemplateList: [], // 代码模板list
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
    this.getTemplateList();
    this.searchTableData();
  },
  methods: {
    // 获取代码模板list
    getTemplateList() {
      getCodeTemplateList().then((res) => {
        const result = res.data;
        if (result.code === 0) {
          this.codeTemplateList = result.data;
        } else {
          this.$message.error(result.desc);
        }
      });
    },

    // 查看失败原因
    viewFileReason(appid) {
      this.$refs.loading.openLoading("正在查询，请稍后。。");
      failReason({ appid })
        .then((res) => {
          this.$refs.loading.closeLoading();
          const result = res.data;
          if (result.code === 0) {
            this.failReason = result.data.failReason;
            this.failReasonImgList = result.data.failScreenShot;
            this.$refs.failReason.openAlarm();
          } else {
            this.$message.error(result.desc);
          }
        })
        .catch(() => {
          this.$refs.loading.closeLoading();
        });
    },

    // 上传小程序
    openCodeUpload(appid) {
      this.$refs.codeUploadModal.setOpenType(appid);
    },

    // 提交审核
    submitAudit(appid) {
      this.$refs.loading.openLoading("操作进行中，请稍后。。");
      submitAudit({ appid })
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

    // 审核撤回
    undocodeAudit(appid) {
      this.$refs.loading.openLoading("操作进行中，请稍后。。");
      backAudit({ appid })
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

    // 通知发布
    noticeIssue(appid) {
      this.$refs.loading.openLoading("操作进行中，请稍后。。");
      noticeIssueInfo({ appid })
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

    // 版本回退
    backLastVersion(appid) {
      this.$refs.loading.openLoading("操作进行中，请稍后。。");
      backVersion({ appid })
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

    cancel() {
      this.$message.warning("操作已取消");
    },

    // 获取体验版二维码
    fetchExperienceQRCode(appid) {
      getQrcode({ appid }).then((res) => {
        const result = res.data;
        if (result.code === 0) {
          this.QRCodeUrl = result.data;
          this.$refs.QRCodeModal.openQRCode();
        } else {
          this.$message.error(result.desc);
        }
      });
    },

    // 绑定 | 解绑体验者
    testerOperate(appid, type) {
      if (type === 0) {
        this.testerTitle = "绑定体验者";
      } else {
        this.testerTitle = "解绑体验者";
      }
      this.$refs.auditWechat.setOpenType(appid, type);
    },

    // 列表查询
    searchTableData() {
      this.tableLoading = true;
      getTableData().then((res) => {
        const result = res.data;
        if (result.code === 0) {
          const { records } = result.data;
          this.dataSource = records;
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
.search {
  margin-bottom: 54px;
}
.fold {
  width: calc(100% - 216px);
  display: inline-block;
}
.operator {
  margin-bottom: 18px;
}
@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
</style>