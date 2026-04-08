import { createMarkdownProcessor } from '@astrojs/markdown-remark';

let _processor: Awaited<ReturnType<typeof createMarkdownProcessor>> | null = null;

export async function getMarkdownProcessor() {
  if (!_processor) {
    _processor = await createMarkdownProcessor({});
  }
  return _processor;
}
