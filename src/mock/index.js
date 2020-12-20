import Mock from "mockjs";
import "@/mock/user/login";
import "@/mock/user/loginByPhone";
import "@/mock/user/routes";
import "@/mock/applet/version";

// 设置全局延时
Mock.setup({
  timeout: "300-600"
});
