<!--
 * @Description: 选择用户弹框
 * @Author: Leo
 * @Date: 2020-12-29 17:00:45
 * @LastEditTime: 2021-01-13 14:10:56
 * @LastEditors: Leo
-->
<template>
  <div class="chooseUser-modal">
    <a-modal :title="pageTitle"
             width="500px"
             :visible="visible"
             :confirm-loading="confirmLoading"
             centered
             destroyOnClose
             @ok="handleOk"
             @cancel="handleCancel">
      <a-form-model ref="ruleForm"
                    :model="form"
                    :rules="rules"
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol">
        <!-- 选择用户 -->
        <a-form-model-item label="选择用户"
                           prop="userIdentify">
          <a-select style="width: 100%"
                    v-model="form.userIdentify"
                    allowClear
                    placeholder="请选择">
            <a-select-option v-for="(item,index) in userIdentifyList"
                             :key="index"
                             :value="item.id">
              {{item.name}}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <!-- loading -->
    <transition name="el-fade-in">
      <loading ref="loading"></loading>
    </transition>
  </div>
</template>

<script>
import { commitBinding } from "@/services/bindingUser";

export default {
  name: "chooseUserModal",
  props: {
    userIdentifyList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      visible: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 16, offset: 1 },
      pageTitle: "选择用户",
      confirmLoading: false,
      form: {
        appid: null,
        userIdentify: null,
      },
      // 搜索项校验规则
      rules: {
        userIdentify: [
          {
            required: true,
            message: "请选择用户",
            trigger: "change",
          },
        ],
      },
    };
  },
  created() {},
  methods: {
    setOpenType(appid) {
      this.form.appid = appid;
      this.visible = true;
    },

    async handleOk() {
      this.confirmLoading = true;
      await this.onSubmit();
      this.confirmLoading = false;
    },
    // 保存
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const data = { ...this.form };
          this.$refs.loading.openLoading("操作进行中，请稍后。。");
          commitBinding(data)
            .then((res) => {
              this.$refs.loading.closeLoading();
              const result = res.data;
              if (result.code === 0) {
                this.$message.success(result.desc);
                this.handleCancel();
              } else {
                this.$message.error(result.desc);
              }
            })
            .catch(() => {
              this.$refs.loading.closeLoading();
            });
        } else {
          return false;
        }
      });
    },
    resetFormFields() {
      this.form = {
        appid: null,
        userIdentify: null,
      };
    },
    handleCancel() {
      this.resetFormFields();
      this.visible = false;
    },
  },
};
</script>
