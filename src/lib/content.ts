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

const contentDirectory = path.join(process.cwd(), 'content');
const postsDirectory = path.join(contentDirectory, 'posts');
const pagesDirectory = path.join(contentDirectory, 'pages');
const categoriesDirectory = path.join(contentDirectory, 'categories');
const tagsDirectory = path.join(contentDirectory, 'tags');


function getRawCategories(): Category[] {
  if (!fs.existsSync(categoriesDirectory)) return [];
  const files = fs.readdirSync(categoriesDirectory);
  return files.map(file => {
    const slug = file.replace(/\.md$/, '');
    const fullPath = path.join(categoriesDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    return {
      slug: data.slug || slug,
      title: data.title,
      description: data.description || '',
      content: content,
      meta_title: data.meta_title,
      meta_description: data.meta_description,
    } as Category;
  });
}

function getRawTags(): Tag[] {
  if (!fs.existsSync(tagsDirectory)) return [];
  const files = fs.readdirSync(tagsDirectory);
  return files.map(file => {
    const slug = file.replace(/\.md$/, '');
    const fullPath = path.join(tagsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    return {
      slug: data.slug || slug,
      title: data.title,
      description: data.description || '',
      content: content,
      meta_title: data.meta_title,
      meta_description: data.meta_description,
    } as Tag;
  });
}

const categoriesFromFiles = getRawCategories();
const categoryTitleMap = new Map(categoriesFromFiles.map(c => [c.title, c.slug]));

const tagsFromFiles = getRawTags();
const tagTitleMap = new Map(tagsFromFiles.map(t => [t.title, t.slug]));


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
      slug,
      content: content.trim(),
      ...data,
      category: {
        title: categoryTitle,
        slug: categoryTitleMap.get(categoryTitle) || slugify(categoryTitle),
      },
      tags: tagTitles.map(t => ({
        title: t,
        slug: tagTitleMap.get(t) || slugify(t),
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
  const fullPath = path.join(pagesDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) {
    return undefined;
  }
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug: slug,
    title: data.title,
    content,
    meta_title: data.meta_title,
    meta_description: data.meta_description,
  };
}

export function getAllPages(): Page[] {
  if (!fs.existsSync(pagesDirectory)) {
    return [];
  }
  const fileNames = fs.readdirSync(pagesDirectory);
  return fileNames
    .map((fileName) => {
      return getPage(fileName.replace(/\.md$/, ''));
    })
    .filter((page): page is Page => page !== undefined);
}


export function getCategory(slug: string): Category | undefined {
  const cat = categoriesFromFiles.find(c => c.slug === slug);
  if (cat) return cat;

  const postWithCategory = posts.find(p => p.category.slug === slug);
  if (postWithCategory) {
    return { slug: postWithCategory.category.slug, title: postWithCategory.category.title };
  }
  return undefined;
}

export function getTag(slug: string): Tag | undefined {
  const tag = tagsFromFiles.find(t => t.slug === slug);
  if (tag) return tag;

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
