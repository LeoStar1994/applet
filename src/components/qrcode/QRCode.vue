<!--
 * @Description: 放大显示二维码modal
 * @Author: Leo
 * @Date: 2021-01-13 10:48:10
 * @LastEditTime: 2021-01-13 15:35:40
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
    <img :src="QRCodeUrl"
         width="440px"
         alt="二维码">
  </a-modal>
</template>

<script>
export default {
  name: "QRCode",
  props: {
    QRCodeUrl: {
      type: String,
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
    openQRCode() {
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
