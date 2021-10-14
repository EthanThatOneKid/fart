import { ModifierType, ReservedType, TypeMap } from "../../lib/gen/typemap.ts";
import { genUniqueNames } from "./common.ts";

const OMIT_PATTERN = /^\_$/;

const typescript: TypeMap = {
  [ReservedType.Default]: "any",
  [ReservedType.Number]: "number",
  [ReservedType.String]: "string",
  [ReservedType.Boolean]: "boolean",

  [ModifierType.Array]: (t: string) => `Array<${t}>`, // foos: array % Foo
  [ModifierType.Async]: (t: string) => `Promise<${t}>`, // bar: async % Bar
  [ModifierType.Dictionary]: (t1: string, t2: string) => `Record<${t1}, ${t2}>`, // dex: dict % <number, Pokemon>
  [ModifierType.Function]: (...t: string[]) => {
    let result = "(";
    const gimmeName = genUniqueNames();
    while (t.length > 1) {
      const { value: name } = gimmeName.next();
      if (!name) break; // In case of emergency
      const argType = t.shift();
      const omitted = argType !== undefined && OMIT_PATTERN.test(argType);
      if (omitted) continue;
      const secondToLast = t.length === 1;
      result += `${name}: ${argType}` +
        (secondToLast ? "" : ", ");
    }
    const returnType = t.pop()?.replace(OMIT_PATTERN, "void") ?? "void";
    return result + `) => ${returnType}`;
  }, // catch: func % <PokeBall, async % CatchStatus>
};

export default typescript;