<!--
 * @Description: 版本控制查看失败原因
 * @Author: Leo
 * @Date: 2021-01-13 10:48:10
 * @LastEditTime: 2021-01-13 15:35:19
 * @LastEditors: Leo
-->
<template>
  <a-modal :title="title"
           width="500px"
           :visible="visible"
           :confirm-loading="confirmLoading"
           centered
           destroyOnClose
           @ok="handleOk"
           @cancel="handleCancel">
    <div style="overflow-y:auto; max-height:500px; padding: 0 10px; text-align:center;">
      <p v-html="failReason"
         class="text-left"></p>
      <img v-for="(item, index) in failReasonImgList"
           :key="index"
           :src="item"
           class="text-center"
           width="400px"
           alt="二维码">
    </div>
  </a-modal>
</template>

<script>
export default {
  name: "FailReason",
  props: {
    failReason: {
      type: String,
      required: true,
    },
    failReasonImgList: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,
    };
  },
  methods: {
    openAlarm() {
      this.visible = true;
    },
    handleOk() {
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
