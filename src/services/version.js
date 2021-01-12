/* 版本控制 */
import {
  VERSIONTABLEDATA,
  VERSIONFAILREASON,
  VERSIONBACK,
  VERSIONAUDIT,
  VERSIONAUDITBACK,
  VERSIONCOMMITCODE,
  CODETEMPLATE,
  VERSIONNOTICE,
  TESTQRCODE,
  BINDTESTER,
  UNBINDTESTER,
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

// 通知发布
export async function noticeIssueInfo(data) {
  return request(VERSIONNOTICE, METHOD.POST, data);
}

// 提交代码
export async function commitCode(data) {
  return request(VERSIONCOMMITCODE, METHOD.POST, data);
}

// 获取代码模板list
export async function getCodeTemplateList() {
  return request(CODETEMPLATE, METHOD.GET);
}

// 获取体验版二维码
export async function getQrcode(data) {
  return request(TESTQRCODE, METHOD.GET, data);
}

// 绑定体验者
export async function bindTester(data) {
  return request(BINDTESTER, METHOD.POST, data);
}

// 解绑体验者
export async function unbindTester(data) {
  return request(UNBINDTESTER, METHOD.POST, data);
}
