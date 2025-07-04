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

function BodyStartSnippets() {
  noStore();
  const snippets = getAllCodeSnippets();

  return (
    <>
      {snippets.map((snippet) =>
        snippet.body_code ? (
          <React.Fragment key={`body-start-${snippet.slug}`}>{parse(snippet.body_code)}</React.Fragment>
        ) : null
      )}
    </>
  );
}

function BodyEndSnippets() {
  noStore();
  const snippets = getAllCodeSnippets();

  return (
    <>
      {snippets.map((snippet) =>
        snippet.body_end_code ? (
          <React.Fragment key={`body-end-${snippet.slug}`}>{parse(snippet.body_end_code)}</React.Fragment>
        ) : null
      )}
    </>
  );
}

export { HeadSnippets, BodyStartSnippets, BodyEndSnippets };
