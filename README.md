# Film Archive

个人胶片摄影档案网站。

## 项目结构

```
film/
├── data/
│   └── rolls.json        # 胶卷数据（在这里添加胶卷和照片）
├── public/
│   └── photos/           # 照片文件放这里
├── app/
│   ├── page.tsx          # 主页（按胶卷类型分组展示）
│   └── roll/[id]/        # 单卷照片页
└── components/
    ├── FilmStockSection   # 胶卷类型区块
    └── PhotoGrid          # 照片网格 + 灯箱
```

## 添加胶卷

编辑 `data/rolls.json`，按以下格式添加：

```json
{
  "id": "roll-004",
  "filmStock": "Kodak Portra 400",
  "rollNumber": 4,
  "date": "2024-09-01",
  "location": "Beijing",
  "camera": "Nikon FM2",
  "description": "可选描述",
  "photos": [
    {
      "id": "roll-004-001",
      "filename": "roll-004-001.jpg",
      "caption": "可选说明"
    }
  ]
}
```

照片文件放入 `public/photos/` 目录，文件名对应 `filename` 字段。

## 本地开发

```bash
npm run dev
```

## 构建 & 部署

项目配置为静态导出，可部署到任何静态托管服务。

### Vercel（推荐）

1. 推送代码到 GitHub
2. 在 Vercel 导入仓库，自动检测为 Next.js 项目
3. 点击 Deploy

### Cloudflare Pages / Netlify / GitHub Pages

```bash
npm run build     # 生成 out/ 目录
```

将 `out/` 目录内容部署到对应平台即可。
