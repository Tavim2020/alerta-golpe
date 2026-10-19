"use client";

import Markdown from "markdown-to-jsx";
import { IRenderMarkdownProps } from "./render-markdown.type";
import { markdownClassName } from "./constants/markdown.constant";

export const RenderMarkdown = ({ children }: IRenderMarkdownProps) => {
  return (
    <article className={markdownClassName}>
      <Markdown>{children}</Markdown>
    </article>
  );
};
