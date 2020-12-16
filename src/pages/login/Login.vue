<template>
  <common-layout>
    <!-- logo、title -->
    <div class="top">
      <div class="header">
        <img alt="logo"
             class="logo"
             src="@/assets/img/logo.png" />
        <h1 class="title">小程序管理后台</h1>
      </div>
    </div>
    <!-- login form -->
    <div class="login">
      <a-form @submit="onSubmit"
              :form="form">
        <a-alert type="error"
                 :closable="true"
                 v-show="error"
                 :message="error"
                 showIcon
                 style="margin-bottom: 24px;" />
        <h2>登录</h2>
        <!-- 账户名 -->
        <a-form-item>
          <a-input autocomplete="autocomplete"
                   size="default"
                   :maxLength="20"
                   placeholder="请输入您的账号"
                   v-decorator="['name', {rules: [{ required: true, message: '请输入您的账号', whitespace: true}]}]">
            <a-icon slot="prefix"
                    type="user" />
          </a-input>
        </a-form-item>
        <!-- 密码 -->
        <a-form-item>
          <a-input size="default"
                   placeholder="请输入密码"
                   :maxLength="20"
                   autocomplete="autocomplete"
                   type="password"
                   v-decorator="['password', {rules: [{ required: true, message: '请输入密码', whitespace: true}]}]">
            <a-icon slot="prefix"
                    type="lock" />
          </a-input>
        </a-form-item>
        <!-- 手机号 -->
        <a-form-item>
          <a-input size="default"
                   placeholder="请输入手机号"
                   :maxLength="13"
                   v-decorator="['phone', {rules: [{ required: true, message: '请输入手机号', whitespace: true}]}]">
            <a-icon slot="prefix"
                    type="mobile" />
          </a-input>
        </a-form-item>
        <!-- 验证码 -->
        <a-form-item>
          <a-row :gutter="8"
                 style="margin: 0 -4px">
            <a-col :span="16">
              <a-input size="default"
                       placeholder="请输入验证码"
                       :maxLength="8"
                       v-decorator="['verificationCode', {rules: [{ required: true, message: '请输入验证码', whitespace: true}]}]">
                <a-icon slot="prefix"
                        type="mail" />
              </a-input>
            </a-col>
            <a-col :span="8"
                   style="padding-left: 4px">
              <a-button style="width: 100%"
                        class="captcha-button"
                        type="primary"
                        size="default">
                <span style="font-size: 12px;">获取验证码</span>
              </a-button>
            </a-col>
          </a-row>
        </a-form-item>

        <!-- 登录 -->
        <a-form-item>
          <a-button :loading="logging"
                    class="login-btn"
                    size="default"
                    htmlType="submit"
                    type="primary">
            <span style="font-size: 16px; width: 180px;">登录</span>
            <a-icon type="arrow-right" />
          </a-button>
        </a-form-item>
      </a-form>
      <!-- 忘记密码 -->
      <div class="forgetPassword">
        密码忘记了？
        <a style="float: right">忘记密码</a>
      </div>
    </div>
  </common-layout>
</template>

<script>
import CommonLayout from "@/layouts/CommonLayout";
import { login, getRoutesConfig } from "@/services/user";
import { setAuthorization } from "@/utils/request";
import { loadRoutes } from "@/utils/routerUtil";
import { mapMutations } from "vuex";

export default {
  name: "Login",
  components: { CommonLayout },
  data() {
    return {
      logging: false,
      error: "",
      form: this.$form.createForm(this),
    };
  },
  methods: {
    ...mapMutations("account", ["setUser", "setPermissions", "setRoles"]),
    // 点击登录
    onSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err) => {
        if (!err) {
          this.logging = true;
          const name = this.form.getFieldValue("name");
          const password = this.form.getFieldValue("password");
          // const allValues = this.form.getFieldsValue();
          login(name, password).then(this.afterLogin);
        }
      });
    },
    // 登录后相关设置
    afterLogin(res) {
      this.logging = false;
      const loginRes = res.data;
      if (loginRes.code >= 0) {
        const { user, permissions, roles } = loginRes.data;
        this.setUser(user);
        this.setPermissions(permissions);
        this.setRoles(roles);
        // 设置token认证信息
        setAuthorization({
          token: loginRes.data.token,
          expireAt: new Date(loginRes.data.expireAt),
        });
        // 获取路由配置
        getRoutesConfig().then((result) => {
          const routesConfig = result.data.data;
          loadRoutes(routesConfig);
          this.$router.push("/appletManagement/authorization"); // 成功登录页跳转首页
          this.$message.success(loginRes.message, 3);
        });
      } else {
        this.error = loginRes.message;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.common-layout {
  .top {
    text-align: center;
    .header {
      position: fixed;
      top: 58px;
      left: 68px;
      a {
        text-decoration: none;
      }
      .logo {
        width: 310px;
        height: 52px;
        vertical-align: top;
      }
      .title {
        font-size: 50px;
        color: @title-color;
        font-family: "Myriad Pro", "Helvetica Neue", Arial, Helvetica,
          sans-serif;
        font-weight: 400;
        position: relative;
        top: 88px;
        left: 84px;
      }
    }
  }
  .login {
    position: fixed;
    top: 319px;
    right: 295px;
    width: 335px;
    min-height: 351px;
    padding: 20px 24px 0;
    background-color: #fff;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.08);
    border-radius: 5px;
    @media screen and (max-width: 576px) {
      width: 95%;
    }
    @media screen and (max-width: 320px) {
      .captcha-button {
        font-size: 14px;
      }
    }
    h2 {
      text-align: center;
      font-size: 24px;
      font-weight: 500;
    }
    .login-btn {
      position: absolute;
      width: 270px;
      bottom: -48px;
      left: 10px;
      height: 46px;
      background: #0077ff;
      box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.1);
      border-radius: 100px;
    }
    .forgetPassword {
      position: absolute;
      bottom: -60px;
      transform: translateX(50%);
      text-align: center;
      height: 17px;
      line-height: 17px;
      font-size: 13px;
      color: #787e8c;
    }
  }
}
</style>
