<!--
 * @Description: 绑定|解绑体验者操作弹框
 * @Author: Leo
 * @Date: 2020-12-29 17:00:45
 * @LastEditTime: 2021-01-18 13:09:36
 * @LastEditors: Leo
-->
<template>
  <div class="auditWechat-modal">
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
        <!-- 微信号 -->
        <a-form-model-item label="微信号"
                           prop="wechatid">
          <a-input v-model="form.wechatid"
                   allowClear
                   placeholder="请输入微信号"
                   :maxLength="30" />
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
import { bindTester, unbindTester } from "@/services/version";

export default {
  name: "AuditWechatModal",
  data() {
    return {
      visible: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 16, offset: 1 },
      pageTitle: "体验者操作",
      confirmLoading: false,
      form: {
        appid: null,
        wechatid: null,
      },
      // 搜索项校验规则
      rules: {
        wechatid: [
          {
            required: true,
            message: "请输入微信号",
            trigger: "blur",
          },
        ],
      },
      openType: null, // 0绑定  1解绑
    };
  },
  created() {},
  methods: {
    setOpenType(appid, openType) {
      this.form.appid = appid;
      this.openType = openType;
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
          if (this.openType === 0) {
            bindTester(data)
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
          } else if (this.openType === 1) {
            unbindTester(data)
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
          }
        } else {
          return false;
        }
      });
    },

    resetFormFields() {
      this.form = {
        appid: null,
        wechatid: null,
      };
    },

    handleCancel() {
      this.resetFormFields();
      this.visible = false;
    },
  },
};
</script>
