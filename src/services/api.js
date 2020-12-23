//跨域代理前缀
// const API_PROXY_PREFIX='/api'
// const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX
const BASE_URL = process.env.VUE_APP_API_BASE_URL;
module.exports = {
  // login
  LOGIN: `${BASE_URL}/login/go`,
  LOGINVERIFYCODE: `${BASE_URL}/login/verifyCode/image`,
  LOGINSMSCODE: `${BASE_URL}/login/verifyCode/sms`,
  LOGINBYPHONE: `${BASE_URL}/loginByPhone`,
  ROUTES: `${BASE_URL}/routes`,

  // version
  VERSIONTABLEDATA: `${BASE_URL}/getVersionTableData`,
  APPLETNAME: `${BASE_URL}/getAppletNameList`,
  ACCOUNT: `${BASE_URL}/getAccountList`,

  // author
  AUTHORTABLEDATA: `${BASE_URL}/getAuthorTableData`,
};
