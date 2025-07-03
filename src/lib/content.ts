import fs from 'fs';
import path from 'path';

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

const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;

function parseFrontmatter(fileContents: string) {
  const match = frontmatterRegex.exec(fileContents);
  const frontmatter = match ? match[1] : '';
  const content = fileContents.replace(frontmatterRegex, '').trim();

  const metadata: { [key: string]: any } = {};
  frontmatter.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      if (key === 'tags') {
        metadata[key] = value ? value.split(',').map(tag => tag.trim()) : [];
      } else {
        metadata[key] = value;
      }
    }
  });

  return { metadata, content };
}


function getPosts(): Post[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const { metadata, content } = parseFrontmatter(fileContents);

    return {
      slug,
      content,
      ...metadata,
    } as Post;
  });

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
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
  const { metadata, content } = parseFrontmatter(fileContents);

  return {
    slug: pageName,
    title: metadata.title,
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
