import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { slugify } from './utils';

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

export interface Category {
  slug: string;
  title: string;
  description?: string;
}

export interface Tag {
  slug: string;
  title: string;
  description?: string;
}

const contentDirectory = path.join(process.cwd(), 'content');
const postsDirectory = path.join(contentDirectory, 'posts');
const pagesDirectory = path.join(contentDirectory, 'pages');
const categoriesDirectory = path.join(contentDirectory, 'categories');
const tagsDirectory = path.join(contentDirectory, 'tags');

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

export function getCategory(slug: string): Category | undefined {
  const filePath = path.join(categoriesDirectory, `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    return undefined;
  }
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(fileContents);

  return {
    slug: slug,
    title: data.title,
    description: data.description || '',
  };
}

export function getTag(slug: string): Tag | undefined {
  const filePath = path.join(tagsDirectory, `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    return undefined;
  }
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(fileContents);

  return {
    slug: slug,
    title: data.title,
    description: data.description || '',
  };
}

export function getAllCategories() {
  if (!fs.existsSync(categoriesDirectory)) {
    const categories = posts.map((post) => post.category);
    return [...new Set(categories)];
  }
  const files = fs.readdirSync(categoriesDirectory);
  const categories = files.map(file => {
    const fileContents = fs.readFileSync(path.join(categoriesDirectory, file), 'utf8');
    const { data } = matter(fileContents);
    return data.title;
  })
  return [...new Set(categories)];
}

export function getPostsByCategory(category: string) {
  return posts.filter((post) => slugify(post.category) === category.toLowerCase());
}

export function getAllTags() {
    if (!fs.existsSync(tagsDirectory)) {
        const tags = posts.flatMap((post) => post.tags);
        return [...new Set(tags)];
    }
    const files = fs.readdirSync(tagsDirectory);
    const tags = files.map(file => {
        const fileContents = fs.readFileSync(path.join(tagsDirectory, file), 'utf8');
        const { data } = matter(fileContents);
        return data.title;
    });
    return [...new Set(tags)];
}

export function getPostsByTag(tag: string) {
  return posts.filter((post) => post.tags.map(t => slugify(t)).includes(tag.toLowerCase()));
}
