import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  thumbnail?: string;
  content: string;
}

export interface Page {
  slug: string;
  title: string;
  content: string;
}

const contentDirectory = path.join(process.cwd(), 'content');
const postsDirectory = path.join(contentDirectory, 'posts');
const pagesDirectory = path.join(contentDirectory, 'pages');

function getPosts(): Post[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const { data, content } = matter(fileContents);
    
    let tags: string[] = [];
    if (data.tags) {
        if (typeof data.tags === 'string') {
            tags = data.tags.split(',').map(tag => tag.trim());
        } else {
            tags = data.tags;
        }
    }

    return {
      slug,
      content,
      ...(data as any),
      tags,
    } as Post;
  });

  return allPostsData.sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));
}

export const posts = getPosts();

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

export function getPage(pageName: string): Page | undefined {
  const fullPath = path.join(pagesDirectory, `${pageName}.md`);
  if (!fs.existsSync(fullPath)) {
    return undefined;
  }
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug: pageName,
    title: data.title,
    content,
  };
}

export function getAllCategories() {
  const categories = posts.map((post) => post.category);
  return [...new Set(categories)];
}

export function getPostsByCategory(category: string) {
  return posts.filter((post) => post.category.toLowerCase() === category.toLowerCase());
}

export function getAllTags() {
  const tags = posts.flatMap((post) => post.tags);
  return [...new Set(tags)];
}

export function getPostsByTag(tag: string) {
  return posts.filter((post) => post.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase()));
}
