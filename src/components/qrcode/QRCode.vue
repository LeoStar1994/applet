<!--
 * @Description: 放大显示二维码modal
 * @Author: Leo
 * @Date: 2021-01-13 10:48:10
 * @LastEditTime: 2021-01-18 12:37:19
 * @LastEditors: Leo
-->
<template>
  <a-modal :title="title"
           width="500px"
           :visible="visible"
           centered
           destroyOnClose
           @cancel="handleCancel">
    <template slot="footer">
      <a-button type="primary"
                @click="handleCancel">关闭</a-button>
    </template>
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
    };
  },
  methods: {
    openQRCode() {
      this.visible = true;
    },
    handleCancel() {
      this.visible = false;
    },
  },
};
</script>
