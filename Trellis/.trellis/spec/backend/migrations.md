# Migration System

智能迁移系统，用于处理模板文件重命名和删除。

## 目录结构

```
src/migrations/
├── index.ts              # 迁移逻辑 (动态加载 JSON)
└── manifests/
    └── {version}.json    # 各版本迁移清单
```

## 添加新版本迁移

创建 `src/migrations/manifests/{version}.json`：

```json
{
  "version": "0.2.0",
  "description": "变更说明",
  "migrations": [
    {
      "type": "rename",
      "from": ".claude/commands/old.md",
      "to": ".claude/commands/new.md",
      "description": "重命名原因"
    },
    {
      "type": "delete",
      "from": ".trellis/scripts/deprecated.py",
      "description": "删除原因"
    }
  ]
}
```

**无需修改任何代码** - 构建时自动复制到 dist。

## 迁移类型

| Type | 必填字段 | 说明 |
|------|----------|------|
| `rename` | `from`, `to` | 重命名文件 |
| `rename-dir` | `from`, `to` | 重命名目录（包含所有子文件） |
| `delete` | `from` | 删除文件 |

### rename-dir 示例

```json
{
  "type": "rename-dir",
  "from": ".trellis/structure",
  "to": ".trellis/spec",
  "description": "重命名 structure 为 spec"
}
```

**特点**：
- 整个目录移动（包括用户添加的文件）
- 自动批量更新 hash 追踪
- 移动后自动清理空的源目录
- 嵌套目录按深度优先处理（避免父目录先移动导致子目录找不到）

## 分类逻辑

| 分类 | 条件 | 行为 |
|------|------|------|
| `auto` | 文件未被用户修改 / rename-dir | 自动迁移 |
| `confirm` | 文件已被用户修改 | 默认询问，`-f` 强制，`-s` 跳过 |
| `conflict` | 新旧路径都存在 | 跳过并提示手动解决 |
| `skip` | 旧路径不存在 | 无需操作 |

## 模板哈希追踪

- 存储位置：`.trellis/.template-hashes.json`
- 用途：检测用户是否修改过模板文件
- 原理：比较当前文件 SHA256 与存储的哈希值
- 初始化：`trellis init` 时自动创建
- 更新：`trellis update` 后自动更新被覆盖文件的哈希

## CLI 使用

```bash
trellis update              # 显示迁移提示
trellis update --migrate    # 执行迁移（修改过的文件会提示确认）
trellis update --migrate -f # 强制迁移（备份后执行）
trellis update --migrate -s # 跳过修改过的文件
```

## 相关文件

- `src/types/migration.ts` - 类型定义
- `src/migrations/index.ts` - 迁移逻辑
- `src/utils/template-hash.ts` - 哈希工具
- `src/commands/update.ts` - 更新命令集成
