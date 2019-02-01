require('dotenv').config();

import { ApolloServer } from "apollo-server";
import "reflect-metadata";
import { buildSchema, useContainer as typeGraphQLUseContainer } from "type-graphql";
import { Container, Inject, Service } from "typedi";
import { createConnection, useContainer as typeORMUseContainer } from "typeorm";

import { PokemonResolver } from "./components/Pokemons/PokemonResolver";
import { TypeResolver } from "./components/Types/TypeResolver";
import config from "./config";
import Seed from "./db/seed/seeds";
import Logger from "./lib/Logger";

typeORMUseContainer(Container);
typeGraphQLUseContainer(Container);

@Service()
class App {
  @Inject()
  public logger: Logger;

  public async bootstrap(): Promise<any> {
    try {
      await createConnection();

      if (config.RUN_SEEDS) {
        this.logger.info('Running seeds');

        const seed = Container.get(Seed);
        await seed.run();

        this.logger.info('Finished running seeds');
      }

      const schema = await buildSchema({
        resolvers: [PokemonResolver, TypeResolver],
      });

      //   const context: Context = { user: defaultUser };

      const server = new ApolloServer({ schema });

      const { url } = await server.listen(config.PORT);

      this.logger.info(`Server is running, GraphQL Playground available at ${url}`);
    } catch (error) {
      this.logger.error(error);
    }
  }
}

const app = Container.get(App);
app.bootstrap();
