import {
  INDENT,
  Indent,
  IndentCacheIndex,
  IndentOption,
} from "../constants/indent.ts";
import { TypeMap } from "../typemaps.ts";
import { Cart, CartEvent, CartHandlerMap } from "./cart.ts";

export interface LoC {
  content: string;
  indentLevel?: number;
}

export class Builder {
  lines: LoC[];
  currentIndentLevel: number;
  constructor(
    private cartridge: Cart,
    private typemap: TypeMap,
    private indent: IndentOption | string,
  ) {
    this.lines = [];
    this.currentIndentLevel = 0;
  }

  private append(line?: string) {
    if (line !== undefined) {
      this.lines.push({
        content: line,
        indentLevel: this.currentIndentLevel,
      });
    }
  }

  public incrementIndentLevel() {
    this.currentIndentLevel++;
  }

  public decrementIndentLevel() {
    // TODO: Assert that indentation level is greater than 0.
    if (this.currentIndentLevel > 0) {
      this.currentIndentLevel--;
    }
  }

  public appendImport(
    source: Parameters<CartHandlerMap[CartEvent.Import]>[0],
    dependencies: Parameters<CartHandlerMap[CartEvent.Import]>[1],
  ) {
    const code = this.cartridge.dispatch(
      CartEvent.Import,
      source,
      dependencies,
    );
    if (code !== null) {
      for (const depId of dependencies) this.typemap[depId] = depId;
      this.append(code);
    }
  }

  public appendOpeningStruct(
    identifier: Parameters<CartHandlerMap[CartEvent.StructOpen]>[0],
    depo?: Parameters<CartHandlerMap[CartEvent.StructOpen]>[1],
  ) {
    const code = this.cartridge.dispatch(
      CartEvent.StructOpen,
      identifier,
      depo,
    );
    if (code !== null) {
      this.typemap[identifier] = identifier;
      this.append(code);
    }
  }

  public appendProperty(
    identifier: Parameters<CartHandlerMap[CartEvent.SetProperty]>[0],
    required?: Parameters<CartHandlerMap[CartEvent.SetProperty]>[1],
    type?: Parameters<CartHandlerMap[CartEvent.SetProperty]>[2],
  ) {
    const code = this.cartridge.dispatch(
      CartEvent.SetProperty,
      identifier,
      required,
      this.getType(type),
    );
    if (code !== null) this.append(code);
  }

  public appendMethod(
    identifier: Parameters<CartHandlerMap[CartEvent.SetMethod]>[0],
    detail?: Parameters<CartHandlerMap[CartEvent.SetMethod]>[1],
  ) {
    const code = this.cartridge.dispatch(
      CartEvent.SetMethod,
      identifier,
      {
        required: detail?.required,
        input: this.getType(detail?.input),
        output: this.getType(detail?.output),
      },
    );
    if (code !== null) this.append(code);
  }

  public appendClosingStruct(
    depo?: Parameters<CartHandlerMap[CartEvent.StructClose]>[0],
  ) {
    const code = this.cartridge.dispatch(CartEvent.StructClose, depo);
    if (code !== null) this.append(code);
  }

  public export(): string {
    // TODO: Assert that indentation level is 0 in order to compile.
    return this.lines.map(({ content, indentLevel = 0 }) =>
      Builder.getIndent(this.indent, indentLevel) + content
    ).join("\n");
  }

  private getType(typeAlias?: string): string | undefined {
    if (typeAlias === undefined) return undefined;
    if (this.typemap[typeAlias] !== undefined) {
      return this.typemap[typeAlias];
    }
    // TODO: Throw error.
    console.log(`no such type ${typeAlias}`);
    return this.typemap._;
  }

  static getIndentOption(
    indentOption: IndentOption | string,
  ): IndentOption | null {
    let option: IndentOption | null = null;
    switch (indentOption) {
      case Indent.Tab1: {
        option = Indent.Tab1;
        break;
      }
      case Indent.Space1: {
        option = Indent.Space1;
        break;
      }
      case Indent.Space2: {
        option = Indent.Space2;
        break;
      }
      case Indent.Space3: {
        option = Indent.Space3;
        break;
      }
      case Indent.Space4: {
        option = Indent.Space4;
        break;
      }
    }
    return option;
  }

  static getCachedIndent(
    indentOption: IndentOption,
    indentLevel: number,
  ): string | null {
    if (0 > indentLevel || indentLevel > 16) return null;
    switch (indentOption) {
      case Indent.Tab1: {
        const indentCacheIndex = -1 *
          Math.floor(indentLevel) as IndentCacheIndex;
        return INDENT[indentCacheIndex];
      }
      case Indent.Space1:
      case Indent.Space2:
      case Indent.Space3:
      case Indent.Space4: {
        const indentCacheIndex = indentOption *
          Math.floor(indentLevel) as IndentCacheIndex;
        return INDENT[indentCacheIndex];
      }
      default:
        return null;
    }
  }

  /**
   * This function will either return a cached indent string
   * from `/lib/constants/indent.ts`.
   *
   * ## Usage
   *
   * ```ts
   * // Tab spacing is represented by -1.
   * getIndent(-1, 1) // "\t"
   * getIndent(-1, 3) // "\t\t\t"
   *
   * // Single, double, triple, and quadruple spaces are
   * // represented by 1, 2, 3, and 4 respectively.
   * getIndent(1, 1) // " "
   * getIndent(1, 3) // "  "
   * getIndent(2, 3) // "      "
   * getIndent(3, 3) // "         "
   * getIndent(4, 3) // "                "
   *
   * // For non-cached indents, a string may be passed
   * // instead and will be computed immediately.
   * getIndent("#", 3) // "###"
   * getIndent("_", 20) // "____________________"
   *
   * // Any invalid indentation options will result in the
   * // return of an empty string.
   * getIndent(5, 1) // ""
   * getIndent(-2, 1) // ""
   * ```
   */
  static getIndent(
    indentOption: IndentOption | string,
    indentLevel: number,
  ): string {
    const option = Builder.getIndentOption(indentOption);
    if (option !== null) {
      const cachedIndent = Builder.getCachedIndent(option, indentLevel);
      if (cachedIndent !== null) return cachedIndent;
    }
    if (typeof indentOption === "string") {
      return indentOption.repeat(Math.max(indentLevel, 0));
    }
    return "";
  }
}
