<!--
 * @Description: login登录页面.
 * @Author: Leo
 * @Date: 2020-12-17 17:39:10
 * @LastEditTime: 2020-12-19 16:32:07
 * @LastEditors: Leo
-->

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
      <a-tabs size="large"
              :tabBarStyle="{textAlign: 'center'}"
              @change="tabChange"
              style="padding: 0 2px;">
        <!-- 账户密码登录 -->
        <a-tab-pane tab="账户密码登录"
                    key="commonLogin">
          <a-alert type="error"
                   :closable="true"
                   v-show="error"
                   :message="error"
                   showIcon
                   style="margin-bottom: 24px;" />
          <a-form @submit="onSubmit"
                  :form="form">
            <a-form-item>
              <!-- 账户名 -->
              <a-input autocomplete="autocomplete"
                       size="default"
                       :maxLength="20"
                       placeholder="请输入您的账号"
                       v-decorator="['name', {rules: [{ required: true, whitespace: true, validator: handleCheckAccount}]}]">
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
          </a-form>
        </a-tab-pane>
        <!-- 手机号登录 -->
        <a-tab-pane tab="手机号登录"
                    key="phoneLogin">
          <a-alert type="error"
                   :closable="true"
                   v-show="errorByPhone"
                   :message="errorByPhone"
                   showIcon
                   style="margin-bottom: 24px;" />
          <a-form @submit="onSubmitByPhone"
                  :form="form1">
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
                <a-col :span="14">
                  <a-input size="default"
                           placeholder="请输入验证码"
                           :maxLength="8"
                           v-decorator="['verificationCode', {rules: [{ required: true, message: '请输入验证码', whitespace: true}]}]">
                    <a-icon slot="prefix"
                            type="mail" />
                  </a-input>
                </a-col>
                <a-col :span="10"
                       style="padding-left: 4px">
                  <a-button style="width: 100%"
                            class="captcha-button"
                            type="primary"
                            @click="getVerificationCode"
                            :disabled="$isEmpty(form1.getFieldValue('phone')) || fetchingCode"
                            size="default">
                    <span v-if="!fetchingCode"
                          style="font-size: 12px;">获取验证码</span>
                    <span v-else
                          style="font-size: 12px;">{{countDownSceonds}}s后重新发送</span>
                  </a-button>
                </a-col>
              </a-row>
            </a-form-item>
          </a-form>
        </a-tab-pane>
      </a-tabs>
      <div>
        <a-form-item>
          <a-button :loading="logging"
                    class="login-btn"
                    size="default"
                    @click="loginSubmit"
                    type="primary">
            <span style="font-size: 16px; width: 180px;">登录</span>
            <a-icon type="arrow-right" />
          </a-button>
        </a-form-item>
      </div>

      <!-- 忘记密码 -->
      <div class="forgetPassword">
        密码忘记了？
        <a style="float: right"
           @click="forgetPassword">忘记密码</a>
      </div>
    </div>
  </common-layout>
</template>

<script>
import CommonLayout from "@/layouts/CommonLayout";
import { login, loginByPhone, getRoutesConfig } from "@/services/user";
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
      errorByPhone: "",
      form: this.$form.createForm(this),
      form1: this.$form.createForm(this),
      currentTabKey: "commonLogin",
      fetchingCode: false,
      countDownSceonds: 60,
      timer: null,
    };
  },
  methods: {
    ...mapMutations("account", ["setUser", "setPermissions", "setRoles"]),
    // tab切换登录方式
    tabChange(activeKey) {
      this.currentTabKey = activeKey;
      if (activeKey === "commonLogin") {
        this.form.resetFields();
      } else {
        this.form1.resetFields();
      }
    },

    // 账号必须为邮箱登录
    handleCheckAccount(rule, value, callback) {
      const emailExp = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
      if (this.$isEmpty(value)) {
        callback("请输入您的账号");
      } else if (!emailExp.test(value)) {
        callback("账号必须输入邮箱！");
      }
      callback();
    },

    // 点击登录按钮
    loginSubmit(e) {
      if (this.currentTabKey === "commonLogin") {
        this.onSubmit(e);
      } else {
        this.onSubmitByPhone(e);
      }
    },

    // 账户密码点击登录
    onSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err) => {
        if (!err) {
          this.logging = true;
          const name = this.form.getFieldValue("name");
          const password = this.form.getFieldValue("password");
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
        if (this.currentTabKey === "common") {
          this.error = loginRes.message;
        } else {
          this.errorByPhone = loginRes.message;
        }
      }
    },

    // 手机号登录
    onSubmitByPhone(e) {
      e.preventDefault();
      this.form1.validateFields((err) => {
        if (!err) {
          this.logging = true;
          const allValues = this.form1.getFieldsValue();
          loginByPhone(allValues).then(this.afterLogin);
        }
      });
    },

    // 获取验证码
    getVerificationCode() {
      this.fetchingCode = true;
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        if (this.countDownSceonds > 0) {
          this.countDownSceonds--;
        } else {
          this.fetchingCode = false;
          this.countDownSceonds = 60;
          // ajax
        }
      }, 1000);
    },

    // 忘记密码
    forgetPassword() {},
  },
};
</script>

<style lang="less" scoped>
@import "../../less/_variables.less";
.common-layout {
  .top {
    text-align: center;
    .header {
      position: fixed;
      top: 58 * @1hx;
      left: 68 * @1wx;
      a {
        text-decoration: none;
      }
      .logo {
        width: 310px;
        height: 52px;
        vertical-align: top;
      }
      .title {
        font-size: 48px;
        color: @title-color;
        font-family: "Myriad Pro", "Helvetica Neue", Arial, Helvetica,
          sans-serif;
        font-weight: 400;
        position: relative;
        top: 70 * @1hx;
        left: 84 * @1wx;
      }
    }
  }
  .login {
    position: fixed;
    top: 310 * @1hx;
    right: 295 * @1wx;
    width: 340px;
    min-height: 252px;
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
      bottom: -50px;
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
