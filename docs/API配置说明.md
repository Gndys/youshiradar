# YouTube工具 - API配置说明

## 📋 功能说明

这两个工具已经内置了5个YouTube API Key，可以自动轮询使用：

### ✨ 主要特性

1. **自动API池管理**：内置5个API Key，自动轮流使用
2. **智能配额检测**：当某个API配额用尽时，自动切换到下一个可用API
3. **实时状态显示**：界面顶部显示当前API使用情况和可用数量
4. **手动切换功能**：可以点击"🔄 切换API"按钮手动切换API
5. **自定义API支持**：可以输入自己的API Key，优先使用自定义API

---

## 🔑 如何替换内置API Key

如果你想使用自己的API Key池，请按以下步骤操作：

### 方法一：直接修改代码（推荐）

1. 用文本编辑器打开HTML文件
2. 找到以下代码块（大约在第657行或第863行）：

```javascript
// API密钥池管理
const API_POOL = [
  'AIzaSyAa1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6', // API Key 1
  'AIzaSyBb2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7', // API Key 2
  'AIzaSyCc3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8', // API Key 3
  'AIzaSyDd4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9', // API Key 4
  'AIzaSyEe5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0'  // API Key 5
];
```

3. 替换为你自己的API Key：

```javascript
// API密钥池管理
const API_POOL = [
  'YOUR_API_KEY_1', // API Key 1
  'YOUR_API_KEY_2', // API Key 2
  'YOUR_API_KEY_3', // API Key 3
  'YOUR_API_KEY_4', // API Key 4
  'YOUR_API_KEY_5'  // API Key 5
];
```

4. 保存文件并刷新浏览器

### 方法二：使用自定义API（临时）

1. 在工具界面的API Key输入框中输入你的API Key
2. 点击"💾 保存自定义API"按钮
3. 工具会优先使用你输入的自定义API，而不是内置的API池

---

## 📊 API用量监控

界面顶部会显示：

```
API池: 5/5 可用 | 使用API #1
```

- **左侧数字**：显示当前可用的API数量 / 总API数量
- **右侧信息**：显示正在使用的API编号或"使用自定义API"

### 颜色说明

- 🟢 **绿色/黄色** (5-3个可用)：正常状态
- 🟡 **黄色** (2个可用)：警告，建议准备新API
- 🔴 **红色** (0个可用)：所有API配额已用尽

---

## 🔄 自动切换机制

当某个API遇到以下情况时会自动切换：

1. **配额超限** (HTTP 403错误)
2. **错误消息包含"quota"或"exceeded"关键词**

切换逻辑：
```
API #1 → API #2 → API #3 → API #4 → API #5 → (全部用尽时提示)
```

---

## 🚀 如何获取YouTube API Key

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 "YouTube Data API v3"
4. 创建凭据 → API密钥
5. （可选）限制API密钥的使用范围以提高安全性

### 免费配额

- 每个API Key每天有 **10,000配额单位**
- 不同操作消耗不同配额：
  - 搜索视频：约100单位/次
  - 获取频道信息：约1单位/次
  - 获取视频详情：约1单位/次

### 建议

- 准备3-5个API Key轮流使用
- 每个API Key约可查询100次搜索或1000个频道
- 配额每天午夜（太平洋时间）重置

---

## ⚠️ 注意事项

1. **安全性**：不要将包含真实API Key的文件分享给他人
2. **配额管理**：合理规划使用，避免短时间内大量请求
3. **备份**：建议定期导出数据备份
4. **隐私**：API Key是敏感信息，请妥善保管

---

## 🛠️ 故障排除

### 问题1：所有API都显示不可用
**解决方案**：
- 检查API Key是否正确
- 确认API Key已启用YouTube Data API v3
- 等待配额重置（每天午夜PST）
- 使用自定义API Key

### 问题2：自动切换不工作
**解决方案**：
- 检查浏览器控制台是否有错误
- 确认所有API Key格式正确（以"AIzaSy"开头）
- 刷新页面重新加载

### 问题3：想增加更多API
**解决方案**：
```javascript
const API_POOL = [
  'API_KEY_1',
  'API_KEY_2',
  'API_KEY_3',
  'API_KEY_4',
  'API_KEY_5',
  'API_KEY_6',  // 新增
  'API_KEY_7',  // 新增
  // ... 可以添加更多
];
```

---

## 📝 版本信息

- **当前版本**：v2.0（带API池管理）
- **更新日期**：2025-10-15
- **新增功能**：
  - ✅ 内置5个API Key
  - ✅ 自动配额检测和切换
  - ✅ 实时状态显示
  - ✅ 手动切换功能
  - ✅ 自定义API支持

---

如有问题，请参考控制台日志或联系开发者。

