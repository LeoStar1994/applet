import { VERSIONTABLEDATA, APPLETNAME, ACCOUNT } from "@/services/api";
import { request, METHOD } from "@/utils/request";

/**
 * 版本控制页面table查询
 * @param appletName 小程序名称
 * @param account 关联用户
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function getVerisonTableData(data) {
  return request(VERSIONTABLEDATA, METHOD.GET, data);
}

// 获取小程序名称list
export async function appletNameList() {
  return request(APPLETNAME, METHOD.GET);
}

// 获取关联用户list
export async function accountList() {
  return request(ACCOUNT, METHOD.GET);
}

// export default {
//   getVerisonTableData
// };
