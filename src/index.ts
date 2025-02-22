import KYVE from "@kyve/core";
import { Command } from "commander";
import { readFileSync } from "fs";
import { version } from "../package.json";
import uploadFunction from "./upload";
import validateFunction from "./validate";

const cli = new Command("@kyve/evm");
cli.requiredOption(
  "-p, --pool <string>",
  "The address of the pool you want to run on."
);
cli.requiredOption(
  "-s, --stake <number>",
  "The amount of tokens you want to stake."
);
cli.requiredOption(
  "-pk, --private-key <string>",
  "Your Ethereum private key that holds $KYVE."
);
cli.option(
  "-k, --keyfile <string>",
  "The path to your Arweave keyfile. [optional]"
);
cli.option(
  "-n, --name <string>",
  "The identifier name of the node. [optional, default = random]"
);
cli.option(
  "-e, --endpoint <string>",
  "A custom Moonbase Alpha endpoint. [optional]"
);
cli.option(
  "-g, --gas-multiplier <string>",
  "The amount that you want to multiply the default gas price by. [optional]"
);
cli.option(
  "-st, --send-statistics <boolean>",
  "Send statistics. [optional, default = true]",
  true
);
cli.version(version, "-v, --version");

(async () => {
  await cli.parseAsync();
  const options = cli.opts();

  const node = new KYVE(
    options.pool,
    "@kyve/evm",
    version,
    options.stake,
    options.privateKey,
    options.keyfile && JSON.parse(readFileSync(options.keyfile, "utf-8")),
    options.name,
    options.endpoint,
    options.gasMultiplier
  );

  node.run(uploadFunction, validateFunction);
})();
