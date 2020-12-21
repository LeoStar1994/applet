<!--
 * @Description: 小程序管理 / 版本控制.
 * @Author: Leo
 * @Date: 2020-12-17 17:39:10
 * @LastEditTime: 2020-12-21 14:13:08
 * @LastEditors: Leo
-->
<template>
  <div class="version-page">
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
                      :dataSource="dataSource"
                      :loading="tableLoading"
                      :pagination="pagination"
                      rowKey="id"
                      @change="handleTableChange">
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
      <div class="clearfix">
        <span>上传文件：</span>
        <a-upload directory
                  :file-list="fileList"
                  :remove="handleRemove"
                  :before-upload="beforeUpload">
          <a-button>
            <a-icon type="file-add" /> 选择文件
          </a-button>
        </a-upload>
        <a-button type="primary"
                  :disabled="fileList.length === 0"
                  :loading="uploading"
                  style="margin-left:70px;"
                  class="mt-20"
                  @click="handleUpload">
          <a-icon type="upload" />
          {{ uploading ? '上传中。' : '上传文件' }}
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { mapState } from "vuex";
import StandardTable from "@/components/table/StandardTable";
import {
  getVerisonTableData,
  appletNameList,
  accountList,
} from "@/services/applet";
// table columns data
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

export default {
  name: "Version",
  components: { StandardTable },
  i18n: require("./i18n"),
  data() {
    return {
      advanced: true,
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
  created() {
    // this.getAppletNameList();
    // this.getAccountList();
  },
  methods: {
    // 获取小程序名称list
    getAppletNameList() {
      appletNameList().then((res) => {
        const result = res.data;
        if (result.code === 0) {
          this.appletNameList = result.data;
        }
      });
    },

    // 获取关联用户list
    getAccountList() {
      accountList().then((res) => {
        const result = res.data;
        if (result.code === 0) {
          this.accountList = result.data;
        }
      });
    },

    // 切换搜索框收起展开
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },

    // 上传小程序
    uploadApplet() {
      this.fileList = [];
      this.visible = true;
    },

    // 通知发布
    noticeIssue() {},

    // 返回上一个版本
    backLastVersion() {},

    // 列表查询
    searchTableData() {
      const data = { ...this.form };
      this.tableLoading = true;
      getVerisonTableData(data).then((res) => {
        const result = res.data;
        if (result.code === 0) {
          this.dataSource = result.data;
          this.pagination.total = result.total;
        }
        this.tableLoading = false;
      });
    },

    handleTableChange(pagination, filters, sorter) {
      console.log(pagination);
      console.log(filters);
      console.log(sorter);
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
      this.$refs.ruleForm.resetFields();
      this.dataSource = [];
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
      // console.log("Clicked cancel button");
      this.fileList = [];
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
  // 监听页面离开事件， 清空页面数据
  beforeRouteLeave(to, from, next) {
    if (to.path !== from.path) {
      this.reset();
    }
    next();
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