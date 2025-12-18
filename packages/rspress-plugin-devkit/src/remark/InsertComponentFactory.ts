import type { Plugin } from 'unified';
import type { Root, Content } from 'mdast';
import { MdxJsxElementFactory } from '../node/MdxJsxElementFactory';
import { getComponentName } from '../utils/getComponentName';

export type InsertPosition = 'pre' | 'post' | 'after-first-heading';

export interface ComponentInsertDescriptor {
  componentPath: string;
  position: InsertPosition;
  propsProvider?: () => Record<string, unknown>;
}

export interface InsertComponentOptions {
  components: ComponentInsertDescriptor[];
}

function getInsertIndex(position: InsertPosition, children: Content[]): number {
  switch (position) {
    case 'pre':
      return 0;
    case 'post':
      return children.length;
    case 'after-first-heading': {
      const headingIndex = children.findIndex(
        (child) => child.type === 'heading' && (child as { depth: number }).depth === 1
      );
      return headingIndex === -1 ? 0 : headingIndex + 1;
    }
    default:
      return 0;
  }
}

export class RemarkInsertComponentPluginFactory {
  constructor(private readonly options: InsertComponentOptions) {}

  get mdxComponents(): string[] {
    return this.options.components.map(({ componentPath }) => componentPath);
  }

  get remarkPlugin(): Plugin<[], Root> {
    const { components } = this.options;

    return () => (tree) => {
      // 按 position 分组，避免插入位置计算错误
      const sortedComponents = [...components].sort((a, b) => {
        const order = { pre: 0, 'after-first-heading': 1, post: 2 };
        return order[a.position] - order[b.position];
      });

      let offset = 0;
      for (const { componentPath, position, propsProvider } of sortedComponents) {
        const componentName = getComponentName(componentPath);
        const props = propsProvider?.() ?? {};
        const element = MdxJsxElementFactory.createFlowElement(componentName, props);
        const insertIndex = getInsertIndex(position, tree.children) + (position === 'post' ? 0 : offset);

        tree.children.splice(insertIndex, 0, element as unknown as Content);

        if (position !== 'post') {
          offset++;
        }
      }
    };
  }
}
