<!--
 * @Description: 小程序管理 / 版本控制.
 * @Author: Leo
 * @Date: 2020-12-17 17:39:10
 * @LastEditTime: 2020-12-19 19:26:46
 * @LastEditors: Leo
-->
<template>
  <div>
    <a-card class="content-contain"
            :style="`min-height: ${pageMinHeight}px`">
      <!-- search -->
      <div :class="advanced ? 'search' : null">
        <a-form-model ref="ruleForm"
                      :model="form"
                      :rules="rules"
                      :label-col="labelCol"
                      :wrapper-col="wrapperCol">
          <a-row>
            <!-- 小程序名称 -->
            <a-col :md="8"
                   :sm="24">
              <a-form-model-item label="小程序名称"
                                 prop="appletName">
                <a-select v-model="form.appletName"
                          placeholder="请选择">
                  <a-select-option v-for="item in appletNameList"
                                   :key="item.id"
                                   :value="item.id">
                    {{item.label}}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <!-- 小程序名称 -->
            <a-col :md="8"
                   :sm="24">
              <a-form-model-item label="关联用户"
                                 prop="account">
                <a-select v-model="form.account"
                          placeholder="请选择">
                  <a-select-option v-for="item in accountList"
                                   :key="item.id"
                                   :value="item.id">
                    {{item.label}}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <span style="float: right; margin-top: 3px;">
              <a-button type="primary"
                        @click="searchTableData">查询</a-button>
              <a-button style="margin-left: 8px"
                        @click="reset">重置</a-button>
              <a @click="toggleAdvanced"
                 style="margin-left: 8px">
                {{advanced ? '收起' : '展开'}}
                <a-icon :type="advanced ? 'up' : 'down'" />
              </a>
            </span>
          </a-row>
        </a-form-model>
      </div>
      <!-- table -->
      <standard-table :columns="columns"
                      :dataSource="dataSource">
        <div slot="auditResult"
             slot-scope="{text}">
          <span :class="[text === 1 ? 'text-red': '', text === 2 ? 'text-orange': '', text === 3 ? 'text-blue': '']">{{auditResultMapText[text]}}</span>
        </div>
        <div slot="action"
             slot-scope="{text, record}">
          <a style="margin-right:12px;"
             @click="uploadApplet">
            <!-- <a-icon type="plus" /> -->
            上传小程序
          </a>
          <a style="margin-right: 12px"
             @click="noticeIssue(text)">通知发布</a>
          <a @click="backLastVersion(record)"
             class="text-orange">返回上一个版本</a>
        </div>
      </standard-table>
    </a-card>
    <a-modal title="上传小程序"
             width="400px"
             :visible="visible"
             :confirm-loading="confirmLoading"
             centered
             destroyOnClose
             @ok="handleOk"
             @cancel="handleCancel">
      <div class="clearfix d-flex">
        <a-upload :file-list="fileList"
                  :remove="handleRemove"
                  :before-upload="beforeUpload">
          <a-button>
            <a-icon type="upload" /> Select File
          </a-button>
        </a-upload>
        <a-button type="primary"
                  :disabled="fileList.length === 0"
                  :loading="uploading"
                  class="ml-12"
                  @click="handleUpload">
          {{ uploading ? '上传服务器' : '请先上传文件' }}
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { mapState } from "vuex";
import StandardTable from "@/components/table/StandardTable";
const columns = [
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
    title: "当前版本",
    dataIndex: "currentVersion",
  },
  {
    title: "最新版本",
    dataIndex: "newestVersion",
  },
  {
    title: "审核结果",
    dataIndex: "auditResult",
    scopedSlots: { customRender: "auditResult" },
  },
  {
    title: "失败原因",
    dataIndex: "failReason",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
  },
];

const dataSource = [
  {
    appletName: "智慧冰球1",
    account: "中国冰球协会",
    adminAccount: "admin1",
    currentVersion: "1.5",
    newestVersion: "1.6",
    auditResult: 1,
    failReason: "未提供相应证明",
    id: 1,
  },
  {
    appletName: "智慧冰球2",
    account: "中国冰球协会",
    adminAccount: "admin2",
    currentVersion: "1.5",
    newestVersion: "1.6",
    auditResult: 2,
    failReason: "未提供相应证明",
    id: 2,
  },
  {
    appletName: "智慧冰球3",
    account: "中国冰球协会",
    adminAccount: "admin3",
    currentVersion: "1.5",
    newestVersion: "1.6",
    auditResult: 3,
    failReason: "未提供相应证明",
    id: 3,
  },
];

export default {
  name: "Version",
  components: { StandardTable },
  i18n: require("./i18n"),
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14, offset: 1 },
      form: {
        appletName: undefined,
        account: undefined,
      },
      // 搜索项校验规则
      rules: {
        appletName: [],
        account: [],
      },
      appletNameList: [
        { label: "小程序1", id: 1 },
        { label: "小程序2", id: 2 },
      ],
      accountList: [
        { label: "用户1", id: 1 },
        { label: "用户2", id: 2 },
      ],
      auditResultMapText: {
        1: "审核中",
        2: "审核失败",
        3: "审核通过",
      },
      advanced: true,
      columns: columns,
      dataSource: dataSource,
      // modal data
      visible: false,
      confirmLoading: false,
      // upload data
      fileList: [],
      uploading: false,
    };
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
    // page header desc
    desc() {
      return this.$t("description");
    },
  },
  methods: {
    // 切换搜索框收起展开
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    // 上传小程序
    uploadApplet() {
      this.visible = true;
    },
    // 通知发布
    noticeIssue() {},
    // 返回上一个版本
    backLastVersion() {},
    // 列表查询
    searchTableData() {
      // const data = { ...this.form };
    },
    // 重置
    reset() {
      this.$refs.ruleForm.resetFields();
    },
    // modal
    handleOk() {
      this.confirmLoading = true;
      setTimeout(() => {
        this.visible = false;
        this.confirmLoading = false;
      }, 2000);
    },
    handleCancel() {
      console.log("Clicked cancel button");
      this.visible = false;
    },

    // upload
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },
    beforeUpload(file) {
      this.fileList = [...this.fileList, file];
      return false;
    },
    handleUpload() {
      const { fileList } = this;
      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append("files[]", file);
      });
      this.uploading = true;

      // You can use any AJAX library you like
    },
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