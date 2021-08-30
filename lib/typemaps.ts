import { LanguageTarget } from "./types.ts";

export interface TypeMap {
  [type: string]: string;
}

export const TYPEMAPS: Record<LanguageTarget, TypeMap> = {
  [LanguageTarget.TypeScript]: Object.entries({
    number: "number",
    string: "string",
    boolean: "boolean",
    date: "Date",
  }).reduce((map, [alias, type]) => {
    map[alias] = type;
    map[`async_${alias}`] = `Promise<${type}>`;
    return map;
  }, {} as Record<string, string>),
  [LanguageTarget.Go]: {},
  [LanguageTarget.Basic]: {},
};