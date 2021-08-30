export enum LanguageTarget {
  TypeScript = "ts",
  Go = "go",
  Basic = "bas",
}

export enum Lexicon {
  Nester = "{",
  Denester = "}",
  Setter = ":",
  RequiredSetter = "*:",
  TypeDefiner = "type",
  ImpoDefiner = "impo",
  Commenter = ";",
  Separator = ",",
  Spacer = " ",
  LineBreaker = "\n",
  StringLiteral = "\`",
  EOF = "",
}

export enum IndentationSetting {
  Tab = "\t",
  SingleSpace = " ",
  DoubleSpace = "  ",
  TripleSpace = "   ",
  QuadrupleSpace = "    ",
}


export const TabIndentation = ["", "\t", "\t\t", "\t\t\t", "\t\t\t\t", "\t\t\t\t\t", "\t\t\t\t\t\t", "\t\t\t\t\t\t\t", "\t\t\t\t\t\t\t\t", "\t\t\t\t\t\t\t\t\t", "\t\t\t\t\t\t\t\t\t\t", "\t\t\t\t\t\t\t\t\t\t\t", "\t\t\t\t\t\t\t\t\t\t\t\t", "\t\t\t\t\t\t\t\t\t\t\t\t\t", "\t\t\t\t\t\t\t\t\t\t\t\t\t\t", "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t"] as const;
export const SingleSpaceIndentation = ["", " ", "  ", "   ", "    ", "     ", "      ", "       ", "        ", "         ", "          ", "           ", "            ", "             ", "              ", "               "] as const;
export const DoubleSpaceIndentation = ["", "  ", "    ", "      ", "        ", "          ", "            ", "              ", "                ", "                  ", "                    ", "                      ", "                        ", "                          ", "                            ", "                              "] as const;
export const TripleSpaceIndentation = ["", "   ", "      ", "         ", "            ", "               ", "                  ", "                     ", "                        ", "                           ", "                              ", "                                 ", "                                    ", "                                       ", "                                          ", "                                             "] as const;
export const QuadrupleSpaceIndentation = ["", "    ", "        ", "            ", "                ", "                    ", "                        ", "                            ", "                                ", "                                    ", "                                        ", "                                            ", "                                                ", "                                                    ", "                                                        ", "                                                            "] as const;

export interface FartSettings {
  target?: LanguageTarget;
  indentation?: IndentationSetting;
  typemap?: Record<string, string>;
}