//跨域代理前缀
// const API_PROXY_PREFIX='/api'
// const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX
const BASE_URL = process.env.VUE_APP_API_BASE_URL;
module.exports = {
  // login
  LOGIN: `http://172.18.1.7:8080/login/go`,
  LOGINVERIFYCODE: `http://172.18.1.7:8080/login/verifyCode/image`,
  LOGINSMSCODE: `http://172.18.1.7:8080/login/verifyCode/sms`,
  LOGINBYPHONE: `${BASE_URL}/loginByPhone`,
  ROUTES: `${BASE_URL}/routes`,

  // version
  VERSIONTABLEDATA: `${BASE_URL}/getVersionTableData`,
  APPLETNAME: `${BASE_URL}/getAppletNameList`,
  ACCOUNT: `${BASE_URL}/getAccountList`,

  // author
  AUTHORTABLEDATA: `${BASE_URL}/getAuthorTableData`,
};
