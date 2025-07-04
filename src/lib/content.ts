import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { slugify } from './utils';

export interface Post {
  slug: string;
  title: string;
  date: string;
  category: { title: string, slug: string };
  tags: { title: string, slug: string }[];
  thumbnail?: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
}

export interface Page {
  slug: string;
  title: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
}

export interface Category {
  slug: string;
  title: string;
  description?: string;
  content?: string;
  meta_title?: string;
  meta_description?: string;
}

export interface Tag {
  slug: string;
  title: string;
  description?: string;
  content?: string;
  meta_title?: string;
  meta_description?: string;
}

export interface CodeSnippet {
  slug: string;
  title: string;
  head_code?: string;
  body_code?: string;
}


const contentDirectory = path.join(process.cwd(), 'content');
const postsDirectory = path.join(contentDirectory, 'posts');
const pagesDirectory = path.join(contentDirectory, 'pages');
const categoriesDirectory = path.join(contentDirectory, 'categories');
const tagsDirectory = path.join(contentDirectory, 'tags');
const codeSnippetsDirectory = path.join(contentDirectory, 'code_snippets');


function getRawData<T extends {slug: string, title: string}>(directory: string): T[] {
  if (!fs.existsSync(directory)) return [];
  const files = fs.readdirSync(directory);
  return files.map(file => {
    if (!file.endsWith('.md')) return null;
    const fileName = file.replace(/\.md$/, '');
    const fullPath = path.join(directory, file);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    if (!data.title) return null;

    return {
      ...data,
      slug: data.slug || slugify(data.title || fileName),
      title: data.title,
      content: content,
    } as T;
  }).filter((item): item is T => item !== null);
}

const categoriesFromFiles = getRawData<Category>(categoriesDirectory);
const categorySlugMap = new Map(categoriesFromFiles.map(c => [c.title, c.slug]));

const tagsFromFiles = getRawData<Tag>(tagsDirectory);
const tagSlugMap = new Map(tagsFromFiles.map(t => [t.title, t.slug]));


function getPosts(): Post[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const slugFromFile = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const { data, content } = matter(fileContents);
    
    let tagTitles: string[] = [];
    if (data.tags) {
        if (typeof data.tags === 'string') {
            tagTitles = data.tags.split(',').map(tag => tag.trim());
        } else {
            tagTitles = data.tags;
        }
    }

    const categoryTitle = data.category || 'Uncategorized';
    
    return {
      ...data,
      slug: data.slug || slugify(data.title) || slugFromFile,
      content: content.trim(),
      category: {
        title: categoryTitle,
        slug: categorySlugMap.get(categoryTitle) || slugify(categoryTitle),
      },
      tags: tagTitles.map(t => ({
        title: t,
        slug: tagSlugMap.get(t) || slugify(t),
      })),
    } as Post;
  });

  return allPostsData.sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));
}

export const posts = getPosts();

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

export function getPage(slug: string): Page | undefined {
  const allPages = getAllPages();
  return allPages.find(p => p.slug === slug);
}

export function getAllPages(): Page[] {
  return getRawData<Page>(pagesDirectory);
}


export function getCategory(slug: string): Category | undefined {
  const cat = categoriesFromFiles.find(c => c.slug === slug);
  if (cat) return cat;

  // Fallback for categories defined only in posts
  const postWithCategory = posts.find(p => p.category.slug === slug);
  if (postWithCategory) {
    return { slug: postWithCategory.category.slug, title: postWithCategory.category.title };
  }
  return undefined;
}

export function getTag(slug: string): Tag | undefined {
  const tag = tagsFromFiles.find(t => t.slug === slug);
  if (tag) return tag;

  // Fallback for tags defined only in posts
  const postWithTag = posts.find(p => p.tags.some(t => t.slug === slug));
  if (postWithTag) {
    const foundTag = postWithTag.tags.find(t => t.slug === slug)!;
    return { slug: foundTag.slug, title: foundTag.title };
  }
  return undefined;
}

export function getAllCategories(): Category[] {
  const allCategories = [...categoriesFromFiles];
  const addedTitles = new Set(categoriesFromFiles.map(c => c.title));

  posts.forEach(post => {
    if (post.category.title && !addedTitles.has(post.category.title)) {
      allCategories.push({
        title: post.category.title,
        slug: post.category.slug,
      });
      addedTitles.add(post.category.title);
    }
  });

  return allCategories;
}

export function getPostsByCategory(categorySlug: string) {
  return posts.filter((post) => post.category.slug === categorySlug.toLowerCase());
}

export function getAllTags(): Tag[] {
  const allTags = [...tagsFromFiles];
  const addedTitles = new Set(tagsFromFiles.map(t => t.title));
  
  posts.forEach(post => {
    post.tags.forEach(tag => {
      if (tag.title && !addedTitles.has(tag.title)) {
        allTags.push({
          title: tag.title,
          slug: tag.slug
        });
        addedTitles.add(tag.title);
      }
    });
  });

  return allTags;
}

export function getPostsByTag(tagSlug: string) {
  return posts.filter((post) => post.tags.some(t => t.slug === tagSlug.toLowerCase()));
}

export function getAllCodeSnippets(): CodeSnippet[] {
  if (!fs.existsSync(codeSnippetsDirectory)) {
    return [];
  }
  const fileNames = fs.readdirSync(codeSnippetsDirectory);
  const allSnippetsData = fileNames.map((fileName) => {
    if (!fileName.endsWith('.md')) return null;
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(codeSnippetsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const { data } = matter(fileContents);
    
    if (!data.title) return null;

    return {
      slug,
      title: data.title,
      head_code: data.head_code,
      body_code: data.body_code,
    } as CodeSnippet;
  }).filter((s): s is CodeSnippet => s !== null);

  return allSnippetsData;
}
