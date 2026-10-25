export const markdownClassName = `
        markdown-content
        w-full min-w-0
        text-base leading-7 text-foreground
        break-words

        [&>*:first-child]:mt-0

        [&_h1]:mb-6
        [&_h1]:mt-10
        [&_h1]:text-2xl
        [&_h1]:font-bold
        [&_h1]:leading-tight
        [&_h1]:tracking-tight

        [&_h2]:mb-4
        [&_h2]:mt-10
        [&_h2]:text-xl
        [&_h2]:font-bold
        [&_h2]:leading-snug
        [&_h2]:tracking-tight

        [&_h3]:mb-3
        [&_h3]:mt-8
        [&_h3]:text-lg
        [&_h3]:font-semibold
        [&_h3]:leading-snug

        [&_p]:mb-5
        [&_p]:leading-8

        [&_strong]:font-bold
        [&_em]:italic

        [&_a]:font-medium
        [&_a]:text-primary
        [&_a]:underline
        [&_a]:underline-offset-4

        [&_ul]:mb-6
        [&_ul]:ml-6
        [&_ul]:list-disc
        [&_ul]:space-y-2

        [&_ol]:mb-6
        [&_ol]:ml-6
        [&_ol]:list-decimal
        [&_ol]:space-y-2

        [&_li]:pl-1
        [&_li]:leading-7

        [&_blockquote]:my-6
        [&_blockquote]:border-l-4
        [&_blockquote]:border-primary/40
        [&_blockquote]:pl-4
        [&_blockquote]:italic
        [&_blockquote]:text-muted-foreground

        [&_hr]:my-10
        [&_hr]:border-border

        [&_table]:my-6
        [&_table]:w-full
        [&_table]:border-collapse
        [&_table]:text-left

        [&_th]:border
        [&_th]:border-border
        [&_th]:bg-muted
        [&_th]:px-4
        [&_th]:py-3
        [&_th]:font-semibold

        [&_td]:border
        [&_td]:border-border
        [&_td]:px-4
        [&_td]:py-3

        [&_pre]:my-6
        [&_pre]:overflow-x-auto
        [&_pre]:rounded-lg
        [&_pre]:bg-muted
        [&_pre]:p-4
        [&_pre]:text-sm

        [&_code]:rounded
        [&_code]:bg-muted
        [&_code]:px-1
        [&_code]:py-0.5
        [&_code]:font-mono
        [&_code]:text-sm

        [&_pre_code]:bg-transparent
        [&_pre_code]:p-0

        [&_img]:my-6
        [&_img]:h-auto
        [&_img]:max-w-full
        [&_img]:rounded-xl

        [&_tr]:align-top

        [&_table]:block
        [&_table]:overflow-x-auto
    `;
