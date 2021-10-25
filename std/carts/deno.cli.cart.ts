import { Cart, CartEventName } from "../../lib/gen/cart.ts";

const denoCli = new Cart();

const makeComment = () => {
  const year = new Date().getFullYear();
  return `// Generated by Fart © ${year}`;
};

const subcommands: string[] = [];

denoCli.on(
  CartEventName.FileStart,
  (event) => {
    event.code.append(`${makeComment()}
import { FartDepartment } from "https://github.com/EthanThatOneKid/fart/raw/main/std/fart/ts/fart_department.ts";
import { IODepartment } from "https://github.com/EthanThatOneKid/fart/raw/main/std/io/ts/io_department.ts";
import { parse } from "https://deno.land/std@0.112.0/flags/mod.ts";

const fart = new FartDepartment(new IODepartment());
`);
  },
);

denoCli.on(
  CartEventName.SetProperty,
  (event) => {
    if (event.method) {
      subcommands.push(event.identifier);
    }
  },
);

denoCli.on(
  CartEventName.FileEnd,
  (event) => {
    event.code.append(`const FLAGS = parse(Deno.args);
const [subcommand] = FLAGS._;

console.log({FLAGS});

switch (subcommand) {
  ${
      subcommands.map((subcommand) =>
        `case "${subcommand}": {
    console.log(await fart.${subcommand}(FLAGS));
    break;
  }`
      ).join("\n")
    }
  default: {
    // console.log(await fart.help());
  }
}

${makeComment()}`);
  },
);

export default denoCli;
