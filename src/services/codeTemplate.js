/* 代码模板列表 */
import { CODETABLEDATA, CODESYNCTEMPLATE } from "@/services/api";
import { request, METHOD } from "@/utils/request";

/**
 * table查询
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function getTableData(data) {
  return request(CODETABLEDATA, METHOD.GET, data);
}

// 同步代码模板列表
export async function syncTemplate(data) {
  return request(CODESYNCTEMPLATE, METHOD.GET, data);
}
