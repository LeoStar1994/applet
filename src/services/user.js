import { LOGIN, LOGINBYPHONE, ROUTES } from "@/services/api";
import { request, METHOD, removeAuthorization } from "@/utils/request";

/**
 * 账户密码登录服务
 * @param name 账户名
 * @param password 账户密码
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function login(name, password) {
  return request(LOGIN, METHOD.POST, {
    name,
    password
  });
}

/**
 * 账户密码登录服务
 * @param phone 手机号
 * @param verificationCode 手机验证码
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function loginByPhone(data) {
  return request(LOGINBYPHONE, METHOD.POST, data);
}

/**
 * 获取路由配置
 */
export async function getRoutesConfig() {
  return request(ROUTES, METHOD.GET);
}

/**
 * 退出登录
 */
export function logout() {
  localStorage.removeItem(process.env.VUE_APP_ROUTES_KEY);
  localStorage.removeItem(process.env.VUE_APP_PERMISSIONS_KEY);
  localStorage.removeItem(process.env.VUE_APP_ROLES_KEY);
  removeAuthorization();
}
export default {
  login,
  logout,
  loginByPhone,
  getRoutesConfig
};
