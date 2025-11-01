# ⚡ 快速入门 - API配置

## 📌 5分钟快速配置指南

### 第一步：获取YouTube API Key

1. **访问Google Cloud Console**
   ```
   https://console.cloud.google.com/
   ```

2. **创建项目**（如果还没有）
   - 点击顶部项目下拉菜单
   - 选择"新建项目"
   - 输入项目名称（如：YouTube工具）
   - 点击"创建"

3. **启用YouTube Data API v3**
   - 在左侧菜单选择"API和服务" → "库"
   - 搜索"YouTube Data API v3"
   - 点击进入，然后点击"启用"

4. **创建API密钥**
   - 在左侧菜单选择"API和服务" → "凭据"
   - 点击"创建凭据" → "API密钥"
   - 复制生成的API Key（格式：AIzaSy...）
   - （可选）点击"限制密钥"设置使用范围

5. **重复步骤4** 创建5个API Key（建议）

---

### 第二步：配置工具

#### 方法A：编辑代码配置（推荐）

1. **用文本编辑器打开HTML文件**
   - Windows：记事本、Notepad++、VSCode
   - Mac：文本编辑、VSCode、Sublime

2. **搜索配置区域**
   - 按 `Ctrl+F`（Mac: `Cmd+F`）
   - 搜索：`API密钥池配置区域`

3. **替换API Key**
   ```javascript
   const API_POOL = [
     'AIzaSyAa1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6', // ❌ 替换这个
     'AIzaSyBb2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7', // ❌ 替换这个
     'AIzaSyCc3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8', // ❌ 替换这个
     'AIzaSyDd4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9', // ❌ 替换这个
     'AIzaSyEe5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0'  // ❌ 替换这个
   ];
   ```
   
   改为：
   ```javascript
   const API_POOL = [
     'AIzaSyC1vB2nM3qR4sT5uV6wX7yZ8aB9cD0eF1g', // ✅ 你的真实API 1
     'AIzaSyD2wC3oN4rS5tU6vW7xY8zA9bC0dE1fG2h', // ✅ 你的真实API 2
     'AIzaSyE3xD4pO5sT6uV7wX8yZ9aB0cD1eF2gH3i', // ✅ 你的真实API 3
     'AIzaSyF4yE5qP6tU7vW8xY9zA0bC1dE2fG3hI4j', // ✅ 你的真实API 4
     'AIzaSyG5zF6rQ7uV8wX9yZ0aB1cD2eF3gH4iJ5k'  // ✅ 你的真实API 5
   ];
   ```

4. **保存文件**（Ctrl+S 或 Cmd+S）

5. **刷新浏览器**（F5）

#### 方法B：使用界面配置（临时）

1. 打开工具页面
2. 在"YouTube API Key"输入框中输入你的API Key
3. 点击"💾 保存自定义API"
4. 开始使用（仅当次有效）

---

### 第三步：验证配置

1. **查看状态显示**
   ```
   API池: 5/5 可用 | 使用API #1
   ```
   - 如果显示"5/5"说明配置成功
   - 如果显示"0/5"说明需要替换真实API

2. **测试功能**
   - 01工具：输入关键词 → 点击"🔍 开始分析"
   - 02工具：输入频道ID → 点击"➕ 添加博主"

3. **观察切换**
   - 点击"🔄 切换API"按钮
   - 状态应该变为"使用API #2"

---

## 🎯 常见问题

### Q1: API Key格式不对？
**A:** 
- ✅ 正确格式：`AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`（39个字符）
- ✅ 必须以"AIzaSy"开头
- ❌ 不要包含空格或换行

### Q2: 提示配额超限？
**A:** 
- 每个API每天10,000配额单位
- 等待第二天自动重置
- 或使用其他API Key

### Q3: 如何知道API是否有效？
**A:** 
- 打开浏览器控制台（F12）
- 切换到"Console"标签
- 查看是否有错误信息

### Q4: 需要几个API Key？
**A:** 
- 最少1个（输入自定义API）
- 建议3-5个（配置在API池中）
- 可以无限添加（修改代码中的数组）

### Q5: 配置后工具还是不工作？
**A:** 检查清单：
- [ ] API Key是否正确复制（无空格）
- [ ] 是否启用了YouTube Data API v3
- [ ] 是否保存了文件
- [ ] 是否刷新了浏览器
- [ ] 浏览器控制台是否有报错

---

## 📊 配额使用参考

| 操作 | 配额消耗 | 说明 |
|------|---------|------|
| 搜索视频 | 100单位 | 01工具的主要操作 |
| 获取频道信息 | 1单位 | 02工具添加博主 |
| 获取视频详情 | 1单位 | 获取观看数等数据 |
| 获取视频列表 | 1单位 | 分析hashtag时使用 |

### 每日可用次数估算
- **单个API（10,000配额）：**
  - 约100次搜索分析
  - 约10,000次频道查询
  - 混合使用：50次搜索 + 5,000次频道查询

- **5个API（50,000配额）：**
  - 约500次搜索分析
  - 约50,000次频道查询

---

## 🔐 安全建议

1. **不要分享包含真实API的文件**
2. **设置API使用限制**（在Google Cloud Console）
   - 限制为YouTube Data API v3
   - 设置IP地址限制（可选）
   - 设置每日请求限制

3. **定期检查使用情况**
   - Google Cloud Console → API和服务 → 信息中心
   - 查看API使用统计

---

## ✅ 配置完成检查表

完成以下所有项目即可开始使用：

- [ ] 已创建Google Cloud项目
- [ ] 已启用YouTube Data API v3
- [ ] 已创建至少1个API Key
- [ ] 已将API Key配置到工具中（方法A或B）
- [ ] 已保存文件并刷新浏览器
- [ ] 状态显示正常（非0/5）
- [ ] 已测试基本功能可用

---

**配置完成！开始享受自动API轮询的便利吧！** 🚀

有任何问题请参考：
- 📖 `API配置说明.md` - 详细文档
- 📝 `更新日志-API池版本.md` - 功能说明

