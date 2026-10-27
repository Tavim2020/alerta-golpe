"use client";

import Markdown from "markdown-to-jsx";
import { IRenderMarkdownProps } from "./render-markdown.type";
import { markdownClassName } from "./constants/markdown.constant";

export const RenderMarkdown = ({
  className,
  children,
}: IRenderMarkdownProps) => {
  return (
    <article className={markdownClassName}>
      <Markdown className={className}>{children}</Markdown>
    </article>
  );
};
