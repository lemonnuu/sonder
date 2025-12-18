import type { Expression } from 'estree-jsx';
import { ESTreeNodeFactory } from './ESTreeNodeFactory';

export interface MdxJsxAttribute {
  type: 'mdxJsxAttribute';
  name: string;
  value: string | MdxJsxAttributeValueExpression | null;
}

export interface MdxJsxAttributeValueExpression {
  type: 'mdxJsxAttributeValueExpression';
  value: string;
  data: {
    estree: {
      type: 'Program';
      body: Array<{
        type: 'ExpressionStatement';
        expression: Expression;
      }>;
      sourceType: 'module';
    };
  };
}

export interface MdxJsxFlowElement {
  type: 'mdxJsxFlowElement';
  name: string;
  attributes: MdxJsxAttribute[];
  children: unknown[];
}

export class MdxJsxElementFactory {
  static createAttributeValueExpression(value: unknown): MdxJsxAttributeValueExpression {
    const expression = ESTreeNodeFactory.fromValue(value);
    return {
      type: 'mdxJsxAttributeValueExpression',
      value: JSON.stringify(value),
      data: {
        estree: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression,
            },
          ],
          sourceType: 'module',
        },
      },
    };
  }

  static createAttribute(name: string, value: unknown): MdxJsxAttribute {
    if (typeof value === 'string') {
      return {
        type: 'mdxJsxAttribute',
        name,
        value,
      };
    }

    return {
      type: 'mdxJsxAttribute',
      name,
      value: MdxJsxElementFactory.createAttributeValueExpression(value),
    };
  }

  static createFlowElement(
    componentName: string,
    props: Record<string, unknown> = {},
    children: unknown[] = []
  ): MdxJsxFlowElement {
    const attributes = Object.entries(props).map(([key, value]) =>
      MdxJsxElementFactory.createAttribute(key, value)
    );

    return {
      type: 'mdxJsxFlowElement',
      name: componentName,
      attributes,
      children,
    };
  }
}
