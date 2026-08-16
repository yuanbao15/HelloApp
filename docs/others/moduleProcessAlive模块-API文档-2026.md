# moduleProcessAlive_2026 模块 API 文档

> - 模块名：`moduleProcessAlive_2026`
> - 类名：`com.epichust.processalive2026.ProcessAliveDemo`
> - 设计：yuanbao
> - 文档更新：2026-08-16

---

## 1. 功能介绍

实现**单进程前台服务保活**，确保进程在切后台、锁屏、长时间运行后不被系统杀死，并提供"被杀后自动重建"和"可随时干净关闭"两项能力。

核心机制：

- **前台服务常驻**：常驻通知（`FLAG_NO_CLEAR` / `FLAG_ONGOING_EVENT`）将进程置于前台优先级，系统 LMK 平时不回收；
- **被杀自动恢复**：服务返回 `START_STICKY`，进程被系统回收后自动重建；
- **15 秒心跳**：周期性重新挂载前台通知，防通知被厂商 ROM 划掉后长期缺失；
- **可随时关闭**：`stopAlive()` 可干净关闭，通知同步移除，杜绝"关不掉"。

> 历史说明：旧模块 `moduleProcessAlive`（2022 版，双进程 Binder 互保方案）已废弃并从 APK 移除，本模块为其 2026 年重构版，方法名与旧模块保持一致（`startAlive` / `stopAlive`），接入方式不变。

## 2. 模块接入初始化

```js
var moduleProcessAlive = null;
apiready = function() {
    moduleProcessAlive = api.require("moduleProcessAlive_2026");
};
```

> 注意：模块名以 `moduleProcessAlive_2026` 为准，不要写成旧模块名 `moduleProcessAlive`，否则无法 require。

## 3. API 说明

### 3.1 开启进程守护 startAlive()

开启进程常驻（前台服务常驻 + 被杀自动恢复），并引导用户加入电池优化白名单。不需要传参。

```js
var params = {};
moduleProcessAlive.startAlive(params, function(ret, err) {
    if (ret) {
        // ret.status === "success"
    } else {
        alert(JSON.stringify(err));
    }
});
```

### 3.2 关闭进程守护 stopAlive()

关闭进程常驻，移除常驻通知，之后服务不会再被拉起。

> 旧模块没有关闭方法（只能手动停止应用），2026 版新增该方法，可随时干净关闭。不需要传参。

```js
var params = {};
moduleProcessAlive.stopAlive(params, function(ret, err) {
    if (ret) {
        // ret.status === "success"
    } else {
        alert(JSON.stringify(err));
    }
});
```

## 4. 电池优化白名单

调用 `startAlive()` 后，模块会自动检查并引导用户加入电池优化白名单：跳转系统设置页，由用户手动将应用设为"不优化/允许"，以提高锁屏休眠状态下应用不被降频限制的概率。

参考：[Android 将应用加入电池优化白名单](https://blog.csdn.net/a872822645/article/details/104535900)

## 5. 代码层面主要逻辑

调用链：`startAlive() → ProcessManager.startAlive() → WorkService（前台服务 + 15s 心跳）`，`stopAlive()` 同理反向。

- `ProcessManager`：静态开关 `sStopFlag` 全局控制，置 `true` 后一切复活路径（系统重建 / 重复启动 / 心跳）自毁；`startAlive()` 按 API 26 分档 `startForegroundService` / `startService`，并引导加入电池白名单；
- `WorkService.onStartCommand()`：开关为 `true` → 移除通知 + `stopSelf` + 返回 `START_NOT_STICKY`；否则无论 Intent 是否为 `null` 都先 `startForeground`（防 Android 8.0+ 5 秒超时崩溃），再返回 `START_STICKY`，被杀后系统自动重建；
- 15 秒心跳：周期性重新挂载前台通知，防 MIUI 等 ROM 划掉通知后长期缺失；
- `stopAlive()`：置 `sStopFlag = true` + `stopService`，通知同步移除，系统不再拉起，实现"关而关"。

## 6. 历史版本记录

### 6.1 历史调试过程问题（网络类，与保活无关）

以 IMOM 的消息接收为例，手机通过 wifi 连接锡柴的 wifi。将应用最小化，锁屏。

- 若干分钟后，进程还在，发送消息正常接收和提醒；
- 一个小时后，进程还在，发送消息不能接收。

通过查看 android studio 的 logcat 控制台日志如下：

![image-20260816103301415](https://yuanbao-oss.oss-cn-shenzhen.aliyuncs.com/img/public_imgs/PicGo/202608161033450.png)

看到 wifi 网络异常：

![image-20260816103150268](https://yuanbao-oss.oss-cn-shenzhen.aliyuncs.com/img/public_imgs/PicGo/202608161031301.png)

**找到原因**：wifi 连接的是内网，一段时间后系统判定网络不可用自动断开了 wifi（因为流量开着，就断 wifi 了），导致无法访问内网。

**解决办法**：应用进程是正常的，只需保证网络不发生改变、不切换其他网络即可。

- 方式一：关闭流量模式，wifi 连接锡柴 wifi 和服务，保证 wifi 不会自动切换去连接其他可上网的 wifi；
- 方式二：自己笔记本起服务，手机 wifi 连接某可用热点，保证手机和电脑在同一局域网，手机连接笔记本的服务（保证手机既可访问 mes 服务又可上网）。

**注**：在终端中输入 `adb shell ps` 可查看进程情况。

### 6.2 2020-07-07 增加关闭应用的省电策略

将调用此模块的包名加入系统白名单，提高锁屏休眠下应用请求频率不被降频。操作：弹窗提醒用户选择是否开启，设置为允许即可。

<img src="https://yuanbao-oss.oss-cn-shenzhen.aliyuncs.com/img/public_imgs/PicGo/202608161033153.png" alt="image-20260816103326105" style="zoom:67%;" />

### 6.3 2022-05-15 Android 高版本适配问题（历史）

平台组用 VUE 的 app，在某些 PDA（Android 版本高于 9）上出现闪退。

![image-20260816103426304](https://yuanbao-oss.oss-cn-shenzhen.aliyuncs.com/img/public_imgs/PicGo/202608161034333.png)

朱博龙解决过程：http://119.96.220.140:9099/article/1653474482219

报错原因：Notification 在 Android 9.0 后需要设置 channel 等。

![image-20260816103440311](https://yuanbao-oss.oss-cn-shenzhen.aliyuncs.com/img/public_imgs/PicGo/202608161034355.png)

当时修复代码如下：

```java
public int onStartCommand(Intent intent, int flags, int startId) {
    if (intent == null) {
        return START_STICKY;
    }
    packageName = intent.getStringExtra("packageName"); // 记录是哪个应用进程启动的服务
    Notification.Builder builder = new Notification.Builder(this.getApplicationContext())
            .setContentIntent(PendingIntent.getActivity(this, 0, intent, 0)) // 设置PendingIntent
            .setContentTitle(getResources().getString(R.string.app_name))
            .setContentText("正在上传...") // 设置上下文内容
            .setWhen(System.currentTimeMillis()); // 设置该通知发生的时间
    String CHANNEL_ONE_ID = "com.primedu.cn";
    String CHANNEL_ONE_NAME = "Channel One";
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        // 修改安卓8.1以上系统报错
        NotificationChannel notificationChannel = new NotificationChannel(CHANNEL_ONE_ID, CHANNEL_ONE_NAME, NotificationManager.IMPORTANCE_MIN);
        notificationChannel.enableLights(false); // 如果使用中的设备支持通知灯，则说明此通知通道是否应显示灯
        notificationChannel.setShowBadge(false); // 是否显示角标
        notificationChannel.setLockscreenVisibility(Notification.VISIBILITY_SECRET);
        NotificationManager manager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        manager.createNotificationChannel(notificationChannel);
        builder.setChannelId(CHANNEL_ONE_ID);
    }
    Notification notification = builder.build(); // 获取构建好的Notification
    notification.defaults = Notification.DEFAULT_SOUND; // 设置为默认的声音
    startForeground(1, notification);
    bindService(new Intent(this, DaemonService.class), mServiceConnection, Context.BIND_IMPORTANT);
    return START_STICKY;
}
```

### 6.4 2026-08 重构为单进程前台服务方案

旧模块（`moduleProcessAlive`，双进程互保 + JobScheduler 轮询）在新系统上已不可行：

- Android 8.0+ 禁止后台 `startService()`，双进程互拉被系统限制；
- 旧实现存在 `intent == null` 未挂前台导致 5 秒超时崩溃、PendingIntent 可变性崩溃等问题；
- 厂商 ROM 对"双进程互拉 + 高频自启"识别并重点打击。

因此 2026 年重构为单进程前台服务方案（即本文所述的 `moduleProcessAlive_2026`），已从 APK 中移除旧模块。

## 附：历史模块包

- 20200707 优化后的旧模块包：[moduleProcessAlive.zip](https://note.youdao.com/yws/res/594/668C626E8E4745B4A679B05D471439BA)
- 2022 版模块包：[moduleProcessAlive_2022.zip](https://note.youdao.com/yws/res/590/BA950D3DCCB5449B94BCE1110C00C2AF)
- 2026版模块包：[moduleProcessAlive_2026.zip](https://yuanbao-oss.oss-cn-shenzhen.aliyuncs.com/file/public/develop_resources/YB/HellloApp/modules/moduleProcessAlive_2026.zip)
