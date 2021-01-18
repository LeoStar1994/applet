<!--
 * @Description: 上传代码弹框
 * @Author: Leo
 * @Date: 2020-12-29 17:00:45
 * @LastEditTime: 2021-01-18 13:38:33
 * @LastEditors: Leo
-->
<template>
  <div class="codeUpload-modal">
    <a-modal :title="pageTitle"
             width="600px"
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
        <!-- 代码模板 -->
        <a-form-model-item label="代码模板"
                           prop="templateId">
          <a-select style="width: 100%"
                    v-model="form.templateId"
                    allowClear
                    @change="codeTemplateChange(form.templateId)"
                    placeholder="请选择">
            <a-select-option v-for="(item,index) in codeTemplateList"
                             :key="index"
                             :value="item.templateId">
              {{item.userVersion}}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 模板ID -->
        <a-form-model-item label="模板ID"
                           prop="ID">
          <a-input v-model="form.ID"
                   placeholder="请输入模板ID"
                   disabled
                   allowClear />
        </a-form-model-item>
        <!-- 模板版本号 -->
        <a-form-model-item label="模板版本号"
                           prop="templateVersion">
          <a-input v-model="form.templateVersion"
                   placeholder="请输入模板版本号"
                   disabled
                   allowClear />
        </a-form-model-item>
        <!-- 模板描述 -->
        <a-form-model-item prop="templateDesc"
                           label="模板描述">
          <a-input v-model="form.templateDesc"
                   :maxLength="200"
                   disabled
                   placeholder="请输入模板描述"
                   allowClear
                   :auto-size="{ minRows: 3, maxRows: 5 }"
                   type="textarea" />
        </a-form-model-item>
        <!-- 添加模板时间 -->
        <a-form-model-item label="添加模板时间"
                           prop="addTime">
          <a-input v-model="form.addTime"
                   placeholder="请输入添加模板时间"
                   disabled
                   allowClear />
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
import { commitCode } from "@/services/version";
export default {
  name: "codeUpload",
  props: {
    codeTemplateList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      visible: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 16, offset: 1 },
      pageTitle: "上传代码",
      confirmLoading: false,
      form: {
        appid: undefined,
        templateId: undefined,
        ID: undefined,
        templateVersion: undefined,
        templateDesc: undefined,
        addTime: undefined,
      },
      // 搜索项校验规则
      rules: {},
    };
  },
  created() {},
  methods: {
    setOpenType(appid) {
      this.form.appid = appid;
      this.visible = true;
    },

    codeTemplateChange(templateId) {
      const chooseTemplate = this.codeTemplateList.find(
        (item) => item.templateId === templateId
      );
      this.form.ID = templateId;
      this.form.templateVersion = chooseTemplate.userVersion;
      this.form.templateDesc = chooseTemplate.userDesc;
      this.form.addTime = chooseTemplate.createTime;
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
          const data = {
            appid: this.form.appid,
            templateId: this.form.templateId,
          };
          this.$refs.loading.openLoading("操作进行中，请稍后。。");
          commitCode(data)
            .then((res) => {
              this.$refs.loading.closeLoading();
              const result = res.data;
              if (result.code === 0) {
                this.$message.success(result.desc);
                this.handleCancel();
                this.$emit("searchTableData");
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
    handleCancel() {
      this.$refs.ruleForm.resetFields();
      this.visible = false;
    },
  },
};
</script>
