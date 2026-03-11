"use client";

import { useState, useEffect } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";

type BookmarkButtonProps = {
  postId: number;
  postSlug: string;
  postTitle: string;
  variant?: "icon" | "full";
};

type BookmarkedPost = {
  id: number;
  slug: string;
  title: string;
  addedAt: string;
};

const STORAGE_KEY = "sitelab-bookmarks";

function getBookmarks(): BookmarkedPost[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveBookmarks(bookmarks: BookmarkedPost[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkedPost[]>([]);

  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);

  function toggle(post: { id: number; slug: string; title: string }) {
    const current = getBookmarks();
    const exists = current.find((b) => b.id === post.id);
    let updated: BookmarkedPost[];
    if (exists) {
      updated = current.filter((b) => b.id !== post.id);
    } else {
      updated = [...current, { ...post, addedAt: new Date().toISOString() }];
    }
    saveBookmarks(updated);
    setBookmarks(updated);
    return !exists;
  }

  function isBookmarked(postId: number) {
    return bookmarks.some((b) => b.id === postId);
  }

  function removeBookmark(postId: number) {
    const current = getBookmarks();
    const updated = current.filter((b) => b.id !== postId);
    saveBookmarks(updated);
    setBookmarks(updated);
  }

  return { bookmarks, toggle, isBookmarked, removeBookmark };
}

export default function BookmarkButton({ postId, postSlug, postTitle, variant = "icon" }: BookmarkButtonProps) {
  const [saved, setSaved] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const bookmarks = getBookmarks();
    setSaved(bookmarks.some((b) => b.id === postId));
  }, [postId]);

  function handleToggle() {
    const bookmarks = getBookmarks();
    const exists = bookmarks.find((b) => b.id === postId);
    let updated: BookmarkedPost[];

    if (exists) {
      updated = bookmarks.filter((b) => b.id !== postId);
      setSaved(false);
    } else {
      updated = [...bookmarks, { id: postId, slug: postSlug, title: postTitle, addedAt: new Date().toISOString() }];
      setSaved(true);
      setAnimate(true);
      setTimeout(() => setAnimate(false), 300);
    }
    saveBookmarks(updated);
  }

  if (variant === "full") {
    return (
      <button
        onClick={handleToggle}
        className={`flex items-center gap-2 text-xs px-3 py-2 border transition-colors ${
          saved
            ? "border-neutral-900 dark:border-neutral-100 text-neutral-900 dark:text-neutral-100 bg-neutral-50 dark:bg-neutral-900"
            : "border-neutral-200 dark:border-neutral-800 text-neutral-400 dark:text-neutral-500 hover:border-neutral-900 dark:hover:border-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
        }`}
      >
        {saved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
        {saved ? "已收藏" : "加入閱讀清單"}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      title={saved ? "移除收藏" : "加入閱讀清單"}
      className={`w-8 h-8 flex items-center justify-center border transition-all ${
        saved
          ? "border-neutral-900 dark:border-neutral-100 text-neutral-900 dark:text-neutral-100"
          : "border-neutral-200 dark:border-neutral-800 text-neutral-400 dark:text-neutral-500 hover:border-neutral-900 dark:hover:border-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
      } ${animate ? "scale-110" : ""}`}
    >
      {saved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
    </button>
  );
}
