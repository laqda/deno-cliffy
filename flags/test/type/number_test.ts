import { assertEquals, assertThrows } from "../../../dev_deps.ts";
import { OptionType } from "../../deprecated.ts";
import { parseFlags } from "../../flags.ts";
import type { ParseFlagsOptions } from "../../types.ts";

const optionalValueOptions = <ParseFlagsOptions> {
  stopEarly: false,
  allowEmpty: false,
  flags: [{
    name: "flag",
    aliases: ["f"],
    type: OptionType.NUMBER,
    optionalValue: true,
  }],
};

const requiredValueOptions = <ParseFlagsOptions> {
  stopEarly: false,
  allowEmpty: false,
  flags: [{
    name: "flag",
    aliases: ["f"],
    type: OptionType.NUMBER,
  }],
};

Deno.test("flags - type - number - with no value", () => {
  const { flags, unknown, literal } = parseFlags(["-f"], optionalValueOptions);

  assertEquals(flags, { flag: true });
  assertEquals(unknown, []);
  assertEquals(literal, []);
});

Deno.test("flags - type - number - with valid value", () => {
  const { flags, unknown, literal } = parseFlags(
    ["--flag", "123"],
    optionalValueOptions,
  );

  assertEquals(flags, { flag: 123 });
  assertEquals(unknown, []);
  assertEquals(literal, []);
});

Deno.test("flags - type - number - with argument", () => {
  const { flags, unknown, literal } = parseFlags(
    ["-f", "456", "unknown"],
    optionalValueOptions,
  );

  assertEquals(flags, { flag: 456 });
  assertEquals(unknown, ["unknown"]);
  assertEquals(literal, []);
});

Deno.test("flags - type - number - with missing value", () => {
  assertThrows(
    () => parseFlags(["-f"], requiredValueOptions),
    Error,
    `Missing value for option "--flag".`,
  );
});

Deno.test("flags - type - number - with invalid string value", () => {
  assertThrows(
    () => parseFlags(["-f", "abc"], requiredValueOptions),
    Error,
    `Option "--flag" must be of type "number", but got "abc".`,
  );
});
