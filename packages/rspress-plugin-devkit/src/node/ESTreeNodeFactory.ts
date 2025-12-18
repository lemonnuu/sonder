import type {
  Identifier,
  Literal,
  ObjectExpression,
  Property,
  ArrayExpression,
  Expression,
} from 'estree-jsx';

export class ESTreeNodeFactory {
  static createIdentifier(name: string): Identifier {
    return {
      type: 'Identifier',
      name,
    };
  }

  static createLiteral(value: string | number | boolean | null): Literal {
    return {
      type: 'Literal',
      value,
    };
  }

  static createProperty(key: string, value: Expression): Property {
    return {
      type: 'Property',
      key: ESTreeNodeFactory.createIdentifier(key),
      value,
      kind: 'init',
      method: false,
      shorthand: false,
      computed: false,
    };
  }

  static createObjectExpression(properties: Property[]): ObjectExpression {
    return {
      type: 'ObjectExpression',
      properties,
    };
  }

  static createArrayExpression(elements: Expression[]): ArrayExpression {
    return {
      type: 'ArrayExpression',
      elements,
    };
  }

  static fromValue(value: unknown): Expression {
    if (value === null) {
      return ESTreeNodeFactory.createLiteral(null);
    }

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return ESTreeNodeFactory.createLiteral(value);
    }

    if (Array.isArray(value)) {
      return ESTreeNodeFactory.createArrayExpression(
        value.map((item) => ESTreeNodeFactory.fromValue(item))
      );
    }

    if (typeof value === 'object') {
      const properties = Object.entries(value as Record<string, unknown>).map(([key, val]) =>
        ESTreeNodeFactory.createProperty(key, ESTreeNodeFactory.fromValue(val))
      );
      return ESTreeNodeFactory.createObjectExpression(properties);
    }

    return ESTreeNodeFactory.createLiteral(null);
  }
}
