# Markdown 语法测试文档

这是一个用于测试文本插件渲染各种 Markdown 语法的文档。

## 1. 标题测试

# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题

## 2. 文本格式测试

**粗体文本** 和 *斜体文本* 以及 ***粗斜体文本***

~~删除线文本~~

<u>下划线文本</u>

`行内代码`

## 3. 列表测试

### 无序列表

- 第一项
- 第二项
  - 嵌套项目 1
  - 嵌套项目 2
    - 深层嵌套 1
    - 深层嵌套 2
- 第三项

### 有序列表

1. 第一项
2. 第二项
   1. 嵌套有序项目 1
   2. 嵌套有序项目 2
3. 第三项

### 任务列表

- [x] 已完成任务
- [ ] 未完成任务
- [ ] 另一个未完成任务

## 4. 图片测试

![示例图片](https://via.placeholder.com/300x200/4287f5/ffffff?text=示例图片)

![小图片](https://via.placeholder.com/100x100/f54287/ffffff?text=小)

## 5. 链接测试

[内联链接](https://www.example.com)

[带标题的链接](https://www.example.com "这是标题")

<https://www.example.com>

## 6. 引用测试

> 这是一个引用块
>
> 可以包含多行内容
>
> > 这是嵌套引用
> >
> > 嵌套内容

## 7. 代码测试

### 行内代码

使用 `console.log('Hello, World!')` 来输出信息。

### 代码块

```javascript
function greet(name) {
    console.log(`Hello, ${name}!`);
    return `Welcome, ${name}`;
}

const message = greet("World");
console.log(message);
```

```python
def fibonacci(n):
    if n <= 1:
        return n
    else:
        return fibonacci(n-1) + fibonacci(n-2)

# 打印斐波那契数列前10项
for i in range(10):
    print(fibonacci(i))
```

```bash
echo "Hello, Bash!"
ls -la
git status
```

## 8. 表格测试

| 姓名 | 年龄 | 职业 | 城市 |
|------|------|------|------|
| 张三 | 25 | 工程师 | 北京 |
| 李四 | 30 | 设计师 | 上海 |
| 王五 | 28 | 产品经理 | 广州 |

| 对齐左 | 居中对齐 | 右对齐 |
|:-------|:-------:|-------:|
| 内容1 | 内容2 | 内容3 |
| 长内容很长很长 | 中等 | 短 |
| A | B | C |

## 9. 分割线测试

---

***

---

## 10. 混合内容测试

### 带格式的列表

1. **粗体列表项**
2. *斜体列表项*
3. `代码列表项`
4. [链接列表项](https://example.com)

### 带引用的段落

这是一个普通段落，后面跟着一个引用：

> 这是引用内容
>
> 引用可以包含 **粗体** 和 *斜体* 文本。

### 带代码的表格

| 功能 | 代码示例 |
|------|----------|
| 输出 | `console.log()` |
| 循环 | `for (let i = 0; i < 10; i++)` |
| 条件 | `if (condition)` |

## 11. 特殊字符测试

&copy; 版权符号
&reg; 注册商标
&trade; 商标符号

&lt; 小于号
&gt; 大于号
&amp; 和号

## 12. 长文本测试

这是一段很长的文本，用于测试滚动功能。Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

## 13. GitHub 风格 Markdown 测试

### 自动链接

https://github.com
user@repository.com

### 脚注

这是一个脚注测试[^1]。

[^1]: 这是脚注的内容

### 任务列表详情

- [x] 完成项目设计
- [x] 编写代码
- [ ] 进行测试
- [ ] 部署上线

### 表情符号

:smile: :heart: :thumbsup: :rocket:

## 14. 数学公式测试 (如果支持)

行内公式：E = mc²

块级公式：
```
∑(i=1 to n) i = n(n+1)/2
```

---

## 测试完成

这个文档包含了主要的 Markdown 语法元素，可以用于测试：

1. ✅ 标题层级
2. ✅ 文本格式化
3. ✅ 各种列表
4. ✅ 图片显示和对齐
5. ✅ 链接功能
6. ✅ 引用块
7. ✅ 代码高亮
8. ✅ 表格渲染
9. ✅ 分割线
10. ✅ 混合内容
11. ✅ 特殊字符
12. ✅ 长文本滚动
13. ✅ GFM 扩展语法

请使用这个文档测试文本插件的各种功能，特别是：
- **水平对齐功能**（左对齐、居中、右对齐）
- **图片对齐效果**
- **滚动功能**
- **Markdown 渲染质量**