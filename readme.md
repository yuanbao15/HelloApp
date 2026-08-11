## YB-HelloApp

### 1 APP概述

基于apicloud平台，使用了aui/swipper等第三方组件来完善样式。

主要是用于测试自己开发的一些自定义模块及某些官方模块。



##### 依赖的自定义模块：

- moduleIflyVoice					讯飞语音唤醒+识别
- moduleProcessAlive_2024			进程守护保活
- moduleNotification_2026			通知栏推送（支持震动开关+时长）
- pdfReader			PDF查看和标注
- moduleUHF  	   超高频RFID读写
- moduleNFC 		NFC读块
- OtherOffLineSpeakModule  	艾普的语音播报（云知声）
- moduleUHF_I6310 		  别的PDA机器的RFID标签读写
- moduleNFC_2023			NFC读块（android版本升级）	
- moduleNFC_ZBL		NFC读块（功能再升级、读写均支持，以及多块、转码）	

##### 依赖的官方模块：

- iflyRecognition			讯飞语音
- IFlyVoice   (废弃)
- smsListener			短信监听
- acc5Util				媒体音量控制
- audioStreamer			原生音频流播放器（**2026-08-11 第四轮新增**，后台/锁屏循环警报，防 WebView 30 秒掐断）
- UIPhotoViewer         图片查看
- shareAction			系统分享
- fileBrowser / fs		文件选择 + 读写（更多页"导入数据"功能使用）



##### 模块：

![image-20250711154254594](https://yuanbao-oss.oss-cn-shenzhen.aliyuncs.com/img/public_imgs/PicGo/202507111543634.png)

![image-20250711154314201](https://yuanbao-oss.oss-cn-shenzhen.aliyuncs.com/img/public_imgs/PicGo/202507111543880.png)



### 2 APP进去导航页

<img src="https://yuanbao-oss.oss-cn-shenzhen.aliyuncs.com/img/public_imgs/PicGo/202210091531913.jpg" alt="img" style="zoom: 50%;" />



### 3 自定义模块-UHF、NFC

<img src="https://yuanbao-oss.oss-cn-shenzhen.aliyuncs.com/img/public_imgs/PicGo/202210091531329.jpg" alt="img" style="zoom:50%;" />



### 4 自定义模块-语音唤醒识别、轮播图、线程守护、PDF查看

<img src="https://yuanbao-oss.oss-cn-shenzhen.aliyuncs.com/img/public_imgs/PicGo/202210091532549.jpg" alt="QQ图片20221009153242" style="zoom:50%;" />



### 5 自定义模块-离线语音播报

<img src="https://yuanbao-oss.oss-cn-shenzhen.aliyuncs.com/img/public_imgs/PicGo/202210091533938.jpg" alt="QQ图片20221009153310" style="zoom:50%;" />



### 6 权限管理测试页

<img src="https://yuanbao-oss.oss-cn-shenzhen.aliyuncs.com/img/public_imgs/PicGo/202210091533598.png" alt="image-20221009153346330" style="zoom:50%;" />




## 7 测试模块-短信监听

<img src="https://yuanbao-oss.oss-cn-shenzhen.aliyuncs.com/img/public_imgs/PicGo/202506261615081.png" alt="image-20250626161512595" style="zoom: 50%;" />




## 8 短信监听增强提醒 APP（核心功能）

> 详细技术文档：[docs/01-功能实现概述.md](docs/01-功能实现概述.md)
>
> 审查记录与待优化项：[docs/02-问题与待优化项.md](docs/02-问题与待优化项.md)

### 8.1 功能简介

- **核心场景**：监听 Android 系统短信，匹配关键词（默认「湖北交警 / 鄂AY366Q」，可自定义）后立即播放警报音效 + 震动 + 通知栏推送
- **数据可视化**：按月份 / 星期 / 时段统计违停警报，含风险等级 / 行为模式 / 智能建议
- **数据备份**：一键导出 / 导入 JSON，含 7 项用户配置 + 近 10 年警报记录
- **应用自升级**：检查更新 → 下载 APK → 引导系统安装

### 8.2 最近更新日志

| 日期 | 轮次 | 关键内容 |
|------|------|---------|
| 2026-08-11 | **第四轮** | **引入 audioStreamer 原生音频流播放器**，解决锁屏/后台 30 秒掐断警报的痛点。`setLoop + openPlayer` 两步走（openPlayer 自动播放），循环由原生播放器维持；新增 8 个封装函数 + `addEventListener` 状态日志 |
| 2026-08-02 | 第三轮补丁 | installApp 安装修复（`appPath` → `appUri`、路径前缀自动转换、APK 下载到系统 Download 目录） |
| 2026-08-02 | 第三轮 | 更多页 6 大功能实装：关于页改全屏 + 刷新/分享、清除缓存分档、导出/导入 JSON、fileBrowser 文件选择 |
| 2026-08-02 | 第二轮 | 6 项可靠性与体验修复（prefs 失败降级、ID 并发加固、mescroll 本地化、关键词大小写不敏感、柱状图闪烁、弹窗手势残留）+ UI 卡片化重构 |
| 2026-08-01 | 第一轮 | 8 个严重 Bug 一次性修完 + 进程保活可停止 + 滑动删除手势重构 + UI 微调 |

### 8.3 真机验收注意事项（第四轮）

- 在 APICloud 控制台 / 离线打包配置中**确认 audioStreamer 模块已加入**，重新生成自定义 Loader
- 厂商系统（小米/华为/OPPO/vivo）需用户在系统设置中开启**「自启动」「后台运行」「电池不限制」**
- 真机测试：触发警报 → 立刻锁屏 → 5/15/30 分钟后听声音是否持续

### 8.4 APP截图：

<img src="https://yuanbao-oss.oss-cn-shenzhen.aliyuncs.com/img/public_imgs/PicGo/202608110958851.png" alt="image-20260811095837649" style="zoom: 33%;" />