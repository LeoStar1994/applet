/* 绑定用户 */
import { BINDINGTABLEDATA, BINDINGCOMMIT, BINDINGINIT } from "@/services/api";
import { request, METHOD } from "@/utils/request";

/**
 * table查询
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function getTableData(data) {
  return request(BINDINGTABLEDATA, METHOD.GET, data);
}

// 初始化
export async function initData(data) {
  return request(BINDINGINIT, METHOD.GET, data);
}

// 提交绑定
export async function commitBinding(data) {
  return request(BINDINGCOMMIT, METHOD.POST, data);
}
