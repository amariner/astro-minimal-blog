'use server';

import { getAllCodeSnippets } from '@/lib/content';
import parse from 'html-react-parser';
import React from 'react';
import { unstable_noStore as noStore } from 'next/cache';

function HeadSnippets() {
  noStore();
  const snippets = getAllCodeSnippets();
  
  return (
    <>
      {snippets.map((snippet) =>
        snippet.head_code ? (
          <React.Fragment key={`head-${snippet.slug}`}>{parse(snippet.head_code)}</React.Fragment>
        ) : null
      )}
    </>
  );
}

function BodySnippets() {
  noStore();
  const snippets = getAllCodeSnippets();

  return (
    <>
      {snippets.map((snippet) =>
        snippet.body_code ? (
          <React.Fragment key={`body-${snippet.slug}`}>{parse(snippet.body_code)}</React.Fragment>
        ) : null
      )}
    </>
  );
}

export { HeadSnippets, BodySnippets };
