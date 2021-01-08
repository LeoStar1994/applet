/* 版本控制 */
import {
  VERSIONTABLEDATA,
  VERSIONFAILREASON,
  VERSIONBACK,
  VERSIONAUDIT,
  VERSIONAUDITBACK,
  VERSIONCOMMITCODE,
  APPLETNAME,
  ACCOUNT,
} from "@/services/api";
import { request, METHOD } from "@/utils/request";

/**
 * table查询
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function getTableData(data) {
  return request(VERSIONTABLEDATA, METHOD.GET, data);
}

// 查看失败原因
export async function failReason(data) {
  return request(VERSIONFAILREASON, METHOD.GET, data);
}

// 版本回退
export async function backVersion(data) {
  return request(VERSIONBACK, METHOD.POST, data);
}

// 提交审核
export async function submitAudit(data) {
  return request(VERSIONAUDIT, METHOD.POST, data);
}

// 撤回审核
export async function backAudit(data) {
  return request(VERSIONAUDITBACK, METHOD.POST, data);
}

// 提交代码
export async function commitCode(data) {
  return request(VERSIONCOMMITCODE, METHOD.POST, data);
}

// 获取小程序名称list
export async function appletNameList() {
  return request(APPLETNAME, METHOD.GET);
}

// 获取关联用户list
export async function accountList() {
  return request(ACCOUNT, METHOD.GET);
}
