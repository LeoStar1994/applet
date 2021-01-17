//跨域代理前缀
// const API_PROXY_PREFIX = "/api";
// const BASE_URL =
//   process.env.NODE_ENV === "production"
//     ? process.env.VUE_APP_API_BASE_URL
//     : API_PROXY_PREFIX;
const BASE_URL = process.env.VUE_APP_API_BASE_URL;
const BBS_BASE_URL = process.env.VUE_APP_API_BBS_BASE_URL;
const SAAS_BASE_URL = process.env.VUE_APP_API_SAAS_BASE_URL;
module.exports = {
  // login
  LOGIN: `${BASE_URL}/wxapplet-admin/api/user/login/goAccount`,
  ROUTES: `${BASE_URL}/routes`,
  HOME: `${BASE_URL}/wxapplet-admin/api/home/index`,
  LOGINVERIFYCODE: `${BASE_URL}/wxapplet-admin/api/user/login/verifyCode/image`, // 图形验证码
  LOGINSMSCODE: `${BASE_URL}/wxapplet-admin/api/user/login/verifyCode/sms`, // 短信验证码
  LOGINBYPHONE: `${BASE_URL}/wxapplet-admin/api/user/login/goMobile`, // 手机登录
  FOEGETPASSWORD: `${BBS_BASE_URL}/login/forgetPassword/validMobile`, // 找回密码验证手机验证码
  FOEGETPASSWORDCODE: `${BBS_BASE_URL}/login/forgetPassword`, // 忘记密码获取手机验证码
  RESETPASSWORD: `${BBS_BASE_URL}/login/forgetPassword/modPassword`, // 重置修改密码
  USERAUDITPASSWORD: `${SAAS_BASE_URL}/home/modPwd`, // 用户修改密码

  /* 版本控制 */

  VERSIONTABLEDATA: `${BASE_URL}/wxapplet-admin/api/miniProgram/codeVersion/query`, // table
  VERSIONFAILREASON: `${BASE_URL}/wxapplet-admin/api/miniProgram/codeVersion/getFailReason`, // 查看失败原因
  VERSIONBACK: `${BASE_URL}/wxapplet-admin/api/miniProgram/codeVersion/revertcoderelease`, // 版本回退
  VERSIONAUDIT: `${BASE_URL}/wxapplet-admin/api/miniProgram/codeVersion/submitAudit`, // 提交审核
  VERSIONAUDITBACK: `${BASE_URL}/wxapplet-admin/api/miniProgram/codeVersion/undocodeaudit`, // 审核撤回
  VERSIONCOMMITCODE: `${BASE_URL}/wxapplet-admin/api/miniProgram/codeVersion/commitCode`, // 上传代码
  VERSIONNOTICE: `${BASE_URL}/wxapplet-admin/api/miniProgram/codeVersion/msgUpdate`, // 通知发布
  CODETEMPLATE: `${BASE_URL}/wxapplet-admin/api/miniProgram/codeTemplate/query`,
  TESTQRCODE: `${BASE_URL}/wxapplet-admin/api/miniProgram/tester/getQrcode`, // 体验二维码
  BINDTESTER: `${BASE_URL}/wxapplet-admin/api/miniProgram/tester/bindTester`, // 绑定体验者
  UNBINDTESTER: `${BASE_URL}/wxapplet-admin/api/miniProgram/tester/unbindTester`, // 解绑

  /* 绑定用户 */

  BINDINGTABLEDATA: `${BASE_URL}/wxapplet-admin/api/miniProgram/bindUser/query`, // table查询
  BINDINGINIT: `${BASE_URL}/wxapplet-admin/api/miniProgram/bindUser/home`, // table查询
  BINDINGCOMMIT: `${BASE_URL}/wxapplet-admin/api/miniProgram/bindUser/bindBbsUser`, // 提交绑定

  /* 小程序列表 */

  APPLETLISTTABLEDATA: `${BASE_URL}/wxapplet-admin/api/miniProgram/management/query`, // table查询
  APPLETROLES: `${BASE_URL}/wxapplet-admin/api/miniProgram/management/getRoles`, // 权限集列表
  APPLETADDAUTH: `${BASE_URL}/wxapplet-admin/api/miniProgram/management/getAuthPageUrl`, // 获取新增小程序授权页面
  APPLETUNBIND: `${BASE_URL}/wxapplet-admin/api/miniProgram/management/unbind`, // 解绑

  /* 代码模板列表 */

  CODETABLEDATA: `${BASE_URL}/wxapplet-admin/api/miniProgram/codeTemplate/query`, // table查询
  CODESYNCTEMPLATE: `${BASE_URL}/wxapplet-admin/api/miniProgram/codeTemplate/syncTemplateList` // 同步代码模板列表
};
