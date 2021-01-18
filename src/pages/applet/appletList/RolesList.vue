<!--
 * @Description: 权限集列表
 * @Author: Leo
 * @Date: 2020-12-29 17:00:45
 * @LastEditTime: 2021-01-18 12:37:10
 * @LastEditors: Leo
-->
<template>
  <div class="rolesList-modal">
    <a-modal :title="pageTitle"
             width="800px"
             :visible="visible"
             centered
             destroyOnClose
             @cancel="handleCancel">
      <!-- table -->
      <standard-table :columns="columns"
                      :dataSource="appletRolesList"
                      rowKey="id">
      </standard-table>
      <template slot="footer">
        <a-button type="primary"
                  @click="handleCancel">关闭</a-button>
      </template>
    </a-modal>

    <!-- loading -->
    <transition name="el-fade-in">
      <loading ref="loading"></loading>
    </transition>
  </div>
</template>

<script>
import StandardTable from "@/components/table/StandardTable";
const columns = [
  {
    title: "权限集ID",
    dataIndex: "id",
  },
  {
    title: "权限集中文名称",
    dataIndex: "name",
  },
  {
    title: "权限集中文描述",
    dataIndex: "desc",
  },
  {
    title: "权限集互斥",
    dataIndex: "mutex",
  },
];

export default {
  name: "RolesListModal",
  components: { StandardTable },
  props: {
    appletRolesList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      visible: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 16, offset: 1 },
      pageTitle: "权限集列表",
      columns: columns,
    };
  },
  created() {},
  methods: {
    setOpenType() {
      this.visible = true;
    },
    handleCancel() {
      this.visible = false;
    },
  },
};
</script>
