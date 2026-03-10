import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PostActions from "@/components/post-actions";

/**
 * 後台文章管理列表 — /admin/posts
 * Server Component，直接查 DB（含 draft）
 */
export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    include: {
      category: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* 標題列 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold text-gray-900">文章管理</h1>
          <p className="text-xs text-gray-400 mt-1">
            共 {posts.length} 篇文章
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="bg-accent text-white text-sm px-4 py-2 rounded-lg hover:bg-accent-dark transition-colors"
        >
          ＋ 新增文章
        </Link>
      </div>

      {/* 文章表格 */}
      {posts.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg mb-2">還沒有文章</p>
          <Link href="/admin/posts/new" className="text-sm text-accent">
            新增第一篇文章 →
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                  狀態
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                  標題
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                  分類
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                  建立時間
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  {/* 發佈狀態 */}
                  <td className="px-4 py-3">
                    {post.published ? (
                      <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded">
                        已發佈
                      </span>
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded">
                        草稿
                      </span>
                    )}
                  </td>

                  {/* 標題 */}
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-900">
                      {post.title}
                    </span>
                    <span className="text-xs text-gray-400 ml-2">
                      /{post.slug}
                    </span>
                  </td>

                  {/* 分類 */}
                  <td className="px-4 py-3 text-gray-500">
                    {post.category.name}
                  </td>

                  {/* 日期 */}
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {post.createdAt.toLocaleDateString("zh-TW")}
                  </td>

                  {/* 操作 */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/posts/${post.slug}`}
                        className="text-xs text-gray-400 hover:text-accent transition-colors"
                      >
                        預覽
                      </Link>
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="text-xs text-accent hover:text-accent-dark transition-colors"
                      >
                        編輯
                      </Link>
                      <PostActions
                        postId={post.id}
                        published={post.published}
                        postTitle={post.title}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
