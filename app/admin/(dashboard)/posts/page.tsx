import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PostActions from "@/components/post-actions";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  let posts: Awaited<ReturnType<typeof prisma.post.findMany<{ include: { category: { select: { name: true } } } }>>> = [];
  let dbError = false;

  try {
    posts = await prisma.post.findMany({
      include: {
        category: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    dbError = true;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">文章管理</h1>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            共 {posts.length} 篇文章
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/categories"
            className="border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            管理分類
          </Link>
          <Link
            href="/admin/posts/new"
            className="bg-accent text-white text-sm px-4 py-2 rounded-lg hover:bg-accent-dark transition-colors"
          >
            ＋ 新增文章
          </Link>
        </div>
      </div>

      {dbError ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <p className="text-lg mb-2">無法載入文章</p>
          <p className="text-sm">請確認資料庫連線是否正常</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <p className="text-lg mb-2">還沒有文章</p>
          <Link href="/admin/posts/new" className="text-sm text-accent">
            新增第一篇文章 →
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">狀態</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">標題</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">分類</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">建立時間</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">操作</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3">
                    {post.published ? (
                      <span className="text-xs bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-2 py-0.5 rounded">已發佈</span>
                    ) : (
                      <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-400 px-2 py-0.5 rounded">草稿</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-900 dark:text-gray-100">{post.title}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">/{post.slug}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{post.category.name}</td>
                  <td className="px-4 py-3 text-gray-400 dark:text-gray-500 text-xs">
                    {post.createdAt.toLocaleDateString("zh-TW")}
                  </td>
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
