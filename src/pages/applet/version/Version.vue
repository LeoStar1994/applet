<!--
 * @Description: 小程序管理 / 版本控制.
 * @Author: Leo
 * @Date: 2020-12-17 17:39:10
 * @LastEditTime: 2020-12-17 19:57:27
 * @LastEditors: Leo
-->
<template>
  <!-- <div class="content-contain"
       :style="`min-height: ${pageMinHeight}px`">
  </div> -->
  <a-card>
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <div :class="advanced ? null: 'fold'">
          <a-row>
            <a-col :md="8"
                   :sm="24">
              <a-form-item label="小程序名称"
                           :labelCol="{span: 5}"
                           :wrapperCol="{span: 18, offset: 1}">
                <a-select placeholder="请选择">
                  <a-select-option value="1">小程序1</a-select-option>
                  <a-select-option value="2">小程序2</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8"
                   :sm="24">
              <a-form-item label="关联用户"
                           :labelCol="{span: 5}"
                           :wrapperCol="{span: 18, offset: 1}">
                <a-select placeholder="请选择">
                  <a-select-option value="1">用户1</a-select-option>
                  <a-select-option value="2">用户2</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <span style="float: right; margin-top: 3px;">
              <a-button type="primary"
                        @click="searchTableData">查询</a-button>
              <a-button style="margin-left: 8px"
                        @click="reset">重置</a-button>
              <!-- <a @click="toggleAdvanced"
                 style="margin-left: 8px">
                {{advanced ? '收起' : '展开'}}
                <a-icon :type="advanced ? 'up' : 'down'" />
              </a> -->
            </span>
          </a-row>
        </div>
      </a-form>
    </div>
    <div>

      <!-- table -->
      <standard-table :columns="columns"
                      :dataSource="dataSource">
        <div slot="description"
             slot-scope="{text, record, index}">
          {{text}}{{record}}{{index}}
        </div>
        <div slot="action"
             slot-scope="{text, record}">
          <a style="margin-right: 8px">
            <a-icon type="plus" />上传小程序
          </a>
          <a style="margin-right: 8px">
            <a-icon type="edit" />通知发布
          </a>
          <a @click="deleteRecord(record.key)">
            <a-icon type="delete" />返回上一个版本
          </a>
        </div>
        <template slot="statusTitle">
          <a-icon type="info-circle" />
        </template>
      </standard-table>
    </div>
  </a-card>
</template>

<script>
import { mapState } from "vuex";
import StandardTable from "@/components/table/StandardTable";
const columns = [
  {
    title: "小程序名称",
    dataIndex: "appletName",
  },
  // {
  //   title: "描述",
  //   dataIndex: "description",
  //   scopedSlots: { customRender: "description" },
  // },
  {
    title: "关联用户",
    dataIndex: "callNo1",
  },
  {
    title: "管理员账号",
    dataIndex: "callNo2",
  },
  {
    title: "当前版本",
    dataIndex: "callNo3",
  },
  {
    title: "最新版本",
    dataIndex: "callNo4",
  },
  {
    title: "审核结果",
    dataIndex: "callNo5",
  },
  {
    title: "失败原因",
    dataIndex: "callNo6",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
  },
];

const dataSource = [];

for (let i = 0; i < 100; i++) {
  dataSource.push({
    key: i,
    no: "NO " + i,
    description: "这是一段描述",
    callNo: Math.floor(Math.random() * 1000),
    status: Math.floor(Math.random() * 10) % 4,
    updatedAt: "2018-07-26",
  });
}

export default {
  name: "Version",
  components: { StandardTable },
  i18n: require("./i18n"),
  data() {
    return {
      advanced: true,
      columns: columns,
      dataSource: dataSource,
      selectedRows: [],
    };
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
    // page header desc
    desc() {
      return this.$t("description");
    },
  },

  authorize: {
    deleteRecord: "delete",
  },
  methods: {
    deleteRecord(key) {
      this.dataSource = this.dataSource.filter((item) => item.key !== key);
      this.selectedRows = this.selectedRows.filter((item) => item.key !== key);
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    // 列表查询
    searchTableData() {},
    // 重置
    reset() {},
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