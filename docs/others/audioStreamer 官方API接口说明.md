# audioStreamer



[openPlayer](https://developer.yonyou.com/docs/Client-API/Open-SDK/audioStreamer#openPlayer)

[pause](https://developer.yonyou.com/docs/Client-API/Open-SDK/audioStreamer#pause)

[resume](https://developer.yonyou.com/docs/Client-API/Open-SDK/audioStreamer#resume)

[stop](https://developer.yonyou.com/docs/Client-API/Open-SDK/audioStreamer#stop)

[seekToTime](https://developer.yonyou.com/docs/Client-API/Open-SDK/audioStreamer#seekToTime)

[setLoop](https://developer.yonyou.com/docs/Client-API/Open-SDK/audioStreamer#setLoop)

[getCurrentTime](https://developer.yonyou.com/docs/Client-API/Open-SDK/audioStreamer#getCurrentTime)

[getBufferingRatio](https://developer.yonyou.com/docs/Client-API/Open-SDK/audioStreamer#getBufferingRatio)

[addEventListener](https://developer.yonyou.com/docs/Client-API/Open-SDK/audioStreamer#addEventListener)

[addProgressListener](https://developer.yonyou.com/docs/Client-API/Open-SDK/audioStreamer#addProgressListener)

[removeProgressListener](https://developer.yonyou.com/docs/Client-API/Open-SDK/audioStreamer#removeProgressListener)

[setVolume](https://developer.yonyou.com/docs/Client-API/Open-SDK/audioStreamer#setVolume)

[getVolume](https://developer.yonyou.com/docs/Client-API/Open-SDK/audioStreamer#getVolume)

[onCall](https://developer.yonyou.com/docs/Client-API/Open-SDK/audioStreamer#onCall)

[onNormal](https://developer.yonyou.com/docs/Client-API/Open-SDK/audioStreamer#onNormal)

# 论坛示例



为帮助用户更好更快的使用原生插件，论坛维护了一个[示例](https://community.yonyou.com/thread-115364-1-1.html)，示例中包含示例代码、知识点讲解、注意事项等，供您参考。

# *原生插件概述*



audioStreamer 是一个音频播放器，使用本原生插件可实现对音频文件的播放、暂停、停止、跳转、设置当前播放位置等各种功能。支持对本地、网络音频资源的播放。

如需支持后台播放功能请参考 config.xml 配置说明文档里关于 BackgroundMode 的配置

配置实例如下：

```
<preference name="backgroundMode" value="audio"/>
```

在 iOS 平台上，当音频在后台播放时，若启动其它播放音频的 APP，则后台播放事件会被挂起。当有电话呼入、呼出或其它占用喇叭的事件发生时，也会打断后台播放音频。被打断播放的事件可通过 addEventListener 接口监听。

iOS平台支持的格式如下：

audio/vnd.wave, audio/aacp, video/3gpp2, audio/mpeg3, audio/mp3, audio/x-caf, audio/mpeg, video/quicktime, audio/x-mpeg3, video/mp4, audio/wav, video/avi, audio/flac, audio/mp4, audio/x-mpg, audio/scpls, video/x-m4v, audio/x-wav, audio/x-aiff, application/ttml+xml, application/vnd.apple.mpegurl, video/3gpp, text/vtt, audio/usac, audio/x-mpeg, audio/wave, audio/x-m4r, audio/x-mp3, audio/AMR, audio/aiff, audio/3gpp2, audio/aac, audio/mpg, audio/mpegurl, audio/x-m4b, application/mp4, audio/x-m4p, audio/x-scpls, audio/x-mpegurl, audio/x-aac, audio/3gpp, audio/basic, audio/x-m4a, application/x-mpegurl

# *原生插件接口*



# **openPlayer**



打开音频播放器，并播放。

openPlayer({params}, callback(ret))

## params

path：

- 类型：字符串
- 描述：音频资源地址，支持本地和网络路径（fs://、widget://、http://、https:// 等）

**注意:如果需要播放"/var/mobile/Containers/Data/Application/239DBA7D-B4E4-4BA6-A100-7A3996A9373B/Documents/uzfs/A6079192279888/test.mp3" 该路径的音频, 需要添加类似".mp3"的后缀,否则不能正常播放。**

## callback(ret)

ret：

- 类型：JSON对象
- 内部字段：

```
{
    status: true,        //布尔类型；操作成功状态值，true|false
    duration:255         //数字类型；视频总时长，单位为秒
}
```

## 示例代码

```
var audioStreamer = api.require('audioStreamer');
audioStreamer.openPlayer({
    path: 'http://7xisq1.com1.z0.glb.clouddn.com/yonbuilder/0d0b81b8bd5ab81bda9ca54267eb9b98.mp3',
}, function(ret) {
    if (ret.status) {
        api.alert({ msg: JSON.stringify(ret) });
    }
});
```

## 可用性

iOS系统，Android系统

可提供的1.0.0及更高版本

# **pause**



暂停播放 ，如果想恢复播放可调用openPlayer继续播放(仅支持安卓这样调用)

pause()

## 示例代码

```
var audioStreamer = api.require('audioStreamer');
audioStreamer.pause();
```

## 可用性

iOS系统，Android系统

可提供的1.0.0及更高版本

# **resume**



恢复播放，仅支持iOS

resume()

## 示例代码

```
var audioStreamer = api.require('audioStreamer');
audioStreamer.resume();
```

## 可用性

iOS系统

可提供的1.0.0及更高版本

# **stop**



停止播放

stop()

## 示例代码

```
var audioStreamer = api.require('audioStreamer');
audioStreamer.stop();
```

## 可用性

iOS系统，Android系统

可提供的1.0.0及更高版本

# **seekToTime**



设置播放位置

seekToTime({params})

## params

time：

- 类型：数字
- 描述：（可选项）播放位置，取值范围大于 0 不超过当前播放音频的总时长，单位为秒（s）
- 默认值：0

## 示例代码

```
var audioStreamer = api.require('audioStreamer');
audioStreamer.seekToTime({
   time: 10
});
```

## 可用性

iOS系统，Android系统

可提供的1.0.0及更高版本

# **setLoop**



设置是否循环播放

setLoop(params)

## params

loop:

- 类型：布尔类型
- 描述：设置是否循环播放

## 示例代码

```
var audioStreamer = api.require('audioStreamer');
audioStreamer.setLoop({loop:true});
```

## 可用性

iOS系统，Android系统

可提供的1.0.2及更高版本

# **getCurrentTime**



获取当前播放的位置

getCurrentTime(callback(ret))

## callback(ret)

ret：

- 类型：JSON对象
- 内部字段：

```
{
    current: 50       //数字类型；当前播放位置，单位为秒（s）
}
```

## 示例代码

```
var audioStreamer = api.require('audioStreamer');
audioStreamer.getCurrentTime(function(ret) {
    api.alert({ msg: ret.current });
});
```

## 可用性

iOS系统，Android系统

可提供的1.0.0及更高版本

# **getBufferingRatio**



获取已缓冲的音频文件占音频文件的百分比

getBufferingRatio(callback(ret))

## callback(ret)

ret：

- 类型：JSON对象
- 内部字段：

```
{
    ratio: 50       //数字类型；获取的已缓冲的音频文件占音频文件的百分比，取值范围：0-100
}
```

## 示例代码

```
var audioStreamer = api.require('audioStreamer');
audioStreamer.getBufferingRatio(function(ret) {
    api.alert({ msg: ret.ratio });
});
```

## 可用性

iOS系统，Android系统

可提供的1.0.0及更高版本

# **addEventListener**



播放状态监听

addEventListener( callback(ret))

## callback(ret)

ret：

- 类型：JSON对象
- 内部字段：

```
{
    BufferingTime: 30       //数字类型；当前缓冲的时间，单位秒
    state: 'prepare'        //字符串类型；当前播放器的状态；取值范围如下：
                           //prepare：准备完成
                           //finished：播放完成
                           //buffering：正在缓冲
                           //pause   暂停 
                           //resume  恢复播放 
}		
```

## 示例代码

```
var audioStreamer = api.require('audioStreamer');
audioStreamer.addEventListener({
}, function(ret) {
    alert(ret.state);
});
```

## 可用性

iOS系统，Android系统

可提供的1.0.0及更高版本

# **addProgressListener**



监听实时播放进度

addProgressListener( callback(ret))

## callback(ret)

ret：

- 类型：JSON对象
- 内部字段：

```
{
 progress:100   // 实时播放进度
}		
```

## 示例代码

```
var audioStreamer = api.require('audioStreamer');
audioStreamer.addProgressListener({
}, function(ret) {
    alert(ret.progress);
});
```

## 可用性

iOS系统，Android系统

可提供的1.0.3及更高版本

# **removeProgressListener**



移除实时播放进度

removeProgressListener( callback(ret))

## callback(ret)

ret：

- 类型：JSON对象
- 内部字段：

```
{
 status:true  //移除成功
}		
```

## 示例代码

```
var audioStreamer = api.require('audioStreamer');
audioStreamer.removeProgressListener({
}, function(ret) {
    alert(ret);
});
```

## 可用性

iOS系统，Android系统

可提供的1.0.3及更高版本

# **setVolume**



设置音量

setVolume({params})

## params

volume：

- 类型：数字
- 描述：（可选项）音量大小（0-1）
- 默认值：0

## 示例代码

```
var audioStreamer = api.require('audioStreamer');
audioStreamer.setVolume({
    volume: 0.6
});
```

## 可用性

iOS系统，Android系统

可提供的1.0.1及更高版本

# **getVolume**



获取音量

getVolume(callback(ret))

## callback(ret)

ret：

- 类型：JSON对象
- 内部字段：

```
{
    volume: 0.5       //数字类型；当前音频播放器的音量，取值范围：0-1
}
```

## 示例代码

```
var audioStreamer = api.require('audioStreamer');
audioStreamer.getVolume(function(ret) {
    api.alert({ msg: ret.volume });
});
```

## 可用性

iOS系统，Android系统

可提供的1.0.1及更高版本

# **onCall**



使声音在听筒播放

onCall()

## 示例代码

```
var audioStreamer = api.require('audioStreamer');
audioStreamer.onCall();
```

## 补充说明

## 可用性

iOS系统，Android系统

可提供的1.0.2及更高版本

# **onNormal**



正常播放声音

onNormal()

## 示例代码

```
var audioStreamer = api.require('audioStreamer');
audioStreamer.onNormal();
```

## 补充说明

## 可用性

iOS系统，Android系统

可提供的1.0.2及更高版本

# 论坛示例



为帮助用户更好更快的使用原生插件，论坛维护了一个[示例](https://community.yonyou.com/thread-115364-1-1.html)，示例中包含示例代码、知识点讲解、注意事项等，供您参考。