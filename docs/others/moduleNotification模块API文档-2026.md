# **moduleNotification 模块** - 2026

-- designed by yuanbao

---

## 0 功能介绍

消息通知推送模块，兼容 **Android 4.1 ~ Android 16+**。支持：

- 自定义通知标题、内容，点击跳转到应用
- **开关铃声**（有声/无声可选）
- **开关震动 + 自定义震动时长**（2秒振/2秒停间歇循环）
- **自定义通知渠道**（不同 App 可设置专属渠道，用户可在系统设置里分别管理）
- 多条通知独立展示，在下拉通知栏和角标中显示

---

## 1 模块接入初始化

```js
var moduleNotification = null;
apiready = function() {
    moduleNotification = api.require("moduleNotification");
};
```

### 1.1 渠道初始化（可选）

不同 App 建议设置专属渠道前缀，避免渠道 ID 冲突，也方便用户在系统通知设置页面区分：

```js
// 在 App 启动时调用一次即可
moduleNotification.setChannelInfo({
    channelId: "com.yourcompany.yourapp.task",   // 渠道ID前缀
    channelName: "任务通知"                        // 用户可见的渠道名称
});
```

> 不调用则使用默认渠道 ID `yb-notification`，渠道名称 `YB-任务通知`。

---

## 2 推消息通知：showNotification()

### 2.1 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `title` | String | **是** | - | 通知标题 |
| `content` | String | **是** | - | 通知内容 |
| `channelId` | String | 否 | 全局默认 | 渠道ID前缀，实际生成两个渠道：`{前缀}-sound` 和 `{前缀}-silent` |
| `channelName` | String | 否 | 全局默认 | 渠道名称前缀，系统设置页显示 `{前缀}` 和 `{前缀}-静音` |
| `soundEnabled` | Boolean | 否 | `true` | 是否播放铃声 |
| `vibrateEnabled` | Boolean | 否 | `true` | 是否震动 |
| `vibrateDuration` | Number | 否 | `0` | 震动持续秒数，`0` = 默认短震动 |

### 2.2 回调返回

```js
{
    status: true   // true=成功, false=失败
    errmsg: ""     // 失败时的错误信息
}
```

### 2.3 震动模式说明

| `vibrateDuration` | 效果 |
|-------------------|------|
| `0`（默认） | 快速短震：振100ms → 停200ms → 振100ms → 停200ms |
| `4` | 震2秒 → 停2秒 |
| `10` | 震2秒 → 停2秒 → 震2秒 → 停2秒 → 震2秒（约10秒） |
| `30` | 15个间隔循环，总计约30秒 |

> 震动模式为 **间歇式**：振2秒停2秒交替进行，不会持续不断震，保护马达。

### 2.4 渠道机制说明

模块内部预建 **两个通知渠道**，根据 `soundEnabled` 自动切换：

```
soundEnabled = true  → 使用 "{前缀}-sound"   渠道（有铃声）
soundEnabled = false → 使用 "{前缀}-silent"  渠道（无铃声）
```

震动由系统 **Vibrator 服务** 独立驱动，不受渠道限制，可逐条通知动态控制时长。

---

## 3 调用示例

### 3.1 最简单的调用（全部默认）

```js
moduleNotification.showNotification({
    title: "设备任务消息",
    content: "缸盖线3号工位停台，待处理"
}, function(ret, err) {
    if (ret && ret.status) {
        console.log("推送成功");
    } else {
        console.log("推送失败: " + JSON.stringify(err));
    }
});
```

> 效果：默认铃声 + 短震动。

### 3.2 仅震动（无声），震动 10 秒

```js
moduleNotification.showNotification({
    title: "紧急报警",
    content: "3号设备温度超标",
    soundEnabled: false,
    vibrateEnabled: true,
    vibrateDuration: 10
}, callback);
```

### 3.3 仅铃声（不震动）

```js
moduleNotification.showNotification({
    title: "系统消息",
    content: "数据同步完成",
    soundEnabled: true,
    vibrateEnabled: false
}, callback);
```

### 3.4 静音通知（无铃声无震动）

```js
moduleNotification.showNotification({
    title: "常规提醒",
    content: "您的报告已生成",
    soundEnabled: false,
    vibrateEnabled: false
}, callback);
```

### 3.5 长震动 30 秒

```js
moduleNotification.showNotification({
    title: "重要告警",
    content: "请立即处理！",
    soundEnabled: true,
    vibrateEnabled: true,
    vibrateDuration: 30
}, callback);
```

### 3.6 自定义渠道（专属 App）

```js
moduleNotification.showNotification({
    title: "任务通知",
    content: "新任务已分配",
    channelId: "com.epichust.mes.task",
    channelName: "MES任务通知"
}, callback);
```

---

## 4 兼容性说明

| Android 版本 | 铃声控制 | 震动控制 | 说明 |
|-------------|---------|---------|------|
| 4.1 ~ 7.x (API 16~25) | Builder 直控 | Builder 直控 | 无渠道概念 |
| 8.0+ (API 26+) | 双渠道切换 | Vibrator 服务 | 绕过 MIUI 渠道不可更新限制 |
| 小米 MIUI | 双渠道切换 | Vibrator 服务 | 已验证小米5/Android 8.0 |

---

## 5 注意事项

1. **通知权限**：首次使用需在系统「设置 → 通知管理」中允许该 App 发送通知
2. **渠道更新**：如需更改渠道配置（铃声/震动默认值），修改 `channelId` 前缀，系统会创建新渠道
3. **VIBRATE 权限**：模块已内置声明，无需额外配置
4. **角标显示**：各厂商角标实现差异较大，部分设备可能不显示

## 6 样式效果

| ![img](https://share.note.youdao.com/yws/public/resource/15fccd6d6d164383ac5cc85991acbb6f/xmlnote/447D019E194C48E38CE0F203CBBE5FC3/577) | ![img](https://share.note.youdao.com/yws/public/resource/15fccd6d6d164383ac5cc85991acbb6f/xmlnote/E76A9FB2FD074BEDBB7E8EBE8D547A5E/570) |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
|                                                              |                                                              |

注意：应用的消息通知功能需要开启：

​    ![0](https://share.note.youdao.com/yws/public/resource/15fccd6d6d164383ac5cc85991acbb6f/xmlnote/5061E855573E47FF8D68C2D320276E47/564)

---

## 附 版本历史

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| v2.0 | 2026-08-09 | 新增 `soundEnabled`/`vibrateEnabled`/`vibrateDuration` 参数；双渠道方案适配 MIUI；震动改为 Vibrator 独立控制；支持自定义渠道前缀；android 4.1~16.0均适配。 |
| v1.2 | 2022-10-20 | 适配 android 9.0的通知渠道 |
| v1.0 | 2019-07-18 | 初始版本，基础通知推送 |

