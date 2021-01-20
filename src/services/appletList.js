/* 小程序列表 */
import {
  APPLETLISTTABLEDATA,
  APPLETROLES,
  APPLETADDAUTH,
  APPLETUNBIND,
  APPLETUPDATEINFO,
} from "@/services/api";
import { request, METHOD } from "@/utils/request";

/**
 * table查询
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function getTableData(data) {
  return request(APPLETLISTTABLEDATA, METHOD.GET, data);
}

// 权限集列表
export async function appletRoles(data) {
  return request(APPLETROLES, METHOD.GET, data);
}

// 获取新增小程序授权页面
export async function appletAuthPage(data) {
  return request(APPLETADDAUTH, METHOD.GET, data);
}

// 解绑
export async function appletUnbind(data) {
  return request(APPLETUNBIND, METHOD.PATCH, data);
}

// 更新基本信息
export async function updateBaseInfo(data) {
  return request(APPLETUPDATEINFO, METHOD.PATCH, data);
}
