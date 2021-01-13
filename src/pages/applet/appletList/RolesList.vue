<!--
 * @Description: 权限集列表
 * @Author: Leo
 * @Date: 2020-12-29 17:00:45
 * @LastEditTime: 2021-01-13 15:34:58
 * @LastEditors: Leo
-->
<template>
  <div class="rolesList-modal">
    <a-modal :title="pageTitle"
             width="800px"
             :visible="visible"
             :confirm-loading="confirmLoading"
             centered
             destroyOnClose
             @ok="handleOk"
             @cancel="handleCancel">
      <!-- table -->
      <standard-table :columns="columns"
                      :dataSource="appletRolesList"
                      rowKey="id">
      </standard-table>
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
      confirmLoading: false,
      columns: columns,
    };
  },
  created() {},
  methods: {
    setOpenType() {
      this.visible = true;
    },

    async handleOk() {
      this.confirmLoading = true;
      setTimeout(() => {
        this.visible = false;
        this.confirmLoading = false;
      }, 1000);
    },
    handleCancel() {
      this.visible = false;
    },
  },
};
</script>
