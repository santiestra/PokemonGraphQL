import { Arg, FieldResolver, Int, Mutation, Query, Resolver, Root } from "type-graphql";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";

import { Pokemon } from "../Pokemons/Pokemon";
import { PokemonType } from "../PokemonTypes/PokemonType";
import { PokemonInput } from "./PokemonInput";

@Resolver((of) => Pokemon)
export class PokemonResolver {
  constructor(
    @InjectRepository(Pokemon) private readonly pokemonRepository: Repository<Pokemon>,
    @InjectRepository(PokemonType) private readonly typeRepository: Repository<PokemonType>,
  ) {}

  @Query((returns) => Pokemon, { nullable: true })
  public pokemon(@Arg("pokemonNumber", (type) => Int) pokemonNumber: number): Promise<Pokemon> {
    return this.pokemonRepository.findOne({ number: pokemonNumber }, { relations: ["pokemonTypes"]});
  }

  @Query((returns) => [Pokemon])
  public async pokemons(): Promise<Pokemon[]> {
    return this.pokemonRepository.find({ relations: ["pokemonTypes"] });
  }

  @Query((returns) => [Pokemon])
  public async searchPokemons(@Arg("name", { nullable: true }) name?: string): Promise<Pokemon[]> {
    try {
      let query = this.pokemonRepository.createQueryBuilder("pokemon");

      if (name) {
        query = query.where("pokemon.name ILIKE :name").setParameters({ name: `%${name}%` });
      }

      return query.getMany();
    } catch (error) {
      return error;
    }
  }

  @Mutation((returns) => Pokemon)
  public async addPokemon(@Arg("pokemon") pokemonInput: PokemonInput): Promise<Pokemon> {
    const pokemon = this.pokemonRepository.create(pokemonInput);
    return await this.pokemonRepository.save(pokemon);
  }

  @FieldResolver()
  public pokemonTypes(@Root() pokemon: Pokemon): PokemonType[] {
    return pokemon.pokemonTypes;
  }
}
