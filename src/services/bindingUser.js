/* 绑定用户 */
import { BINDINGTABLEDATA, BINDINGCOMMIT } from "@/services/api";
import { request, METHOD } from "@/utils/request";

/**
 * table查询
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function getTableData(data) {
  return request(BINDINGTABLEDATA, METHOD.GET, data);
}

// 提交绑定
export async function commitBinding(data) {
  return request(BINDINGCOMMIT, METHOD.GET, data);
}
