<template>
  <div class="footer">
    <div class="copyright">
      {{copyright}}
      <p>客服电话：400-12345678</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "PageFooter",
  props: ["copyright"],
};
</script>

<style lang="less" scoped>
.footer {
  padding: 48px 16px 24px;
  text-align: center;
  .copyright {
    color: @text-color-second;
    font-size: 14px;
  }
  p {
    font-size: 12px;
  }
}
</style>
