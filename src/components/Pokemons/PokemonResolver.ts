import { Arg, FieldResolver, Int, Mutation, Query, Resolver, Root } from "type-graphql";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";

import { Pokemon } from "../Pokemons/Pokemon";
import { Type } from "../Types/Type";
import { PokemonInput } from "./PokemonInput";

@Resolver((of) => Pokemon)
export class PokemonResolver {
  constructor(
    @InjectRepository(Pokemon) private readonly pokemonRepository: Repository<Pokemon>,
    @InjectRepository(Type) private readonly typeRepository: Repository<Type>,
  ) {}

  @Query((returns) => Pokemon, { nullable: true })
  public pokemon(@Arg("pokemonNumber", (type) => Int) pokemonNumber: number): Promise<Pokemon> {
    return this.pokemonRepository.findOne({ number: pokemonNumber });
  }

  @Query((returns) => [Pokemon])
  public async pokemons(): Promise<Pokemon[]> {
    return await this.pokemonRepository.createQueryBuilder().orderBy("number", "ASC").getMany();
  }

  @Query((returns) => [Pokemon])
  public async searchPokemons(@Arg("type", { nullable: true }) type?: string): Promise<Pokemon[]> {
    try {
      const typeToSearch = await this.typeRepository.findOneOrFail({ name: type });

      return await this.pokemonRepository.find({ typeId: typeToSearch.id });
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
  public async type(@Root() pokemon: Pokemon): Promise<Type> {
    return (await this.typeRepository.findOne(pokemon.typeId, { cache: 1000 }))!;
  }
}
