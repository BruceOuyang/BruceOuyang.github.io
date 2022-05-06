## Mac 小技巧 <!-- {docsify-ignore} -->

### 用命令行打开 idea
1、添加 `idea` 系统指令，运行 idea，然后做如下操作
```
顶部 Tools > Create command-line luancher
```

2、打开终端，执行命令，即可打开`idea`
```bash
# idea [project_path]
idea ~/workspace/project1
```
> 此方法可用于 IntelliJ 所有套件(idea/webstorm/datagrip/goland...)

### finder 显示隐藏文件夹
快捷键(重复按可切换显示和隐藏)
```
shift + command + .
```

### finder 显示 home 目录
```
shift + command + h
```

### 系统截图方法
#### 1、mac 系统默认截图
> 系统偏好设置 - 键盘 - 快捷键 - 截屏

1.1 全屏截屏
```
# 截屏存储为文件
shift⇧ + command⌘ + 3

# 截屏到剪贴板
shift⇧ + control⌃ + command⌘ + 3
```

1.2 区域截屏
```
# 截屏存储为文件
shift⇧ + command⌘ + 4

# 截屏到剪贴板
shift⇧ + control⌃ + command⌘ + 4
```

1.3 触控栏截屏
```
# 截屏存储为文件
shift⇧ + command⌘ + 6

# 截屏到剪贴板
shift⇧ + control⌃ + command⌘ + 6
```

1.4 截屏和录制选项
```
shift⇧ + command⌘ + 5
```

#### 2、mac + chrome 网页完整截图
```
第一步：打开 chrome，输入目标网页地址
第二步：按快捷键 option⌥ + command⌘ + i
第三步：按快捷键 shift⇧ + command⌘ + p
第四步：输入 capture full 后，按回车
```

### 重置应用软件方法（以 atom 为例）

1、退出 atom

2、在程序坞中，找到并打开 finder

3、在 finder 中，进入用户主目录（按快捷键 `command + shift + h`）

4、在 finder 中，显示隐藏目录（按快捷键 `command + shift + .`）

5、在 finder 中，删除应用配置目录，atom 的配置目录是 `.atom`，直接移除到废纸篓

6、重新打开 atom（按快捷键 `command + 空格` 打开聚焦，输入 atom，然后回车即可），此时 atom 已经恢复原始配置了