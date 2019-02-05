import { Service } from "typedi";
import { InsertResult, Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";

import { O_DIRECT } from "constants";
import { type } from "os";
import { Pokemon } from "../../components/Pokemons/Pokemon";
import { PokemonType } from "../../components/PokemonTypes/PokemonType";

import pokedexFile from "./pokedex.json";

interface IPokemonFromJSON {
  type: string[];
  id: number;
  name: any;
}

@Service()
export default class Seed {
  @InjectRepository(Pokemon) public pokemonRepository: Repository<Pokemon>;
  @InjectRepository(PokemonType) public typeRepository: Repository<PokemonType>;

  public async run() {
    const types = await this.createTypes();
    const pokemons = await this.createPokemons(types);
  }

  private async createTypes(): Promise<PokemonType[]> {
    const allTypes = this.getTypesFromJSON();
    const existingTypes = await this.typeRepository.find();
    const existingTypesNames = existingTypes.map((pokemonType: PokemonType) => pokemonType.name);

    const typesToInsert = allTypes.reduce((result: PokemonType[], pokemonType: string) => {
      if (existingTypesNames.indexOf(pokemonType) < 0) {
        result.push(this.typeRepository.create({ name: type }));
      }

      return result;
    }, []);

    try {
      if (typesToInsert.length > 0) {
        return this.typeRepository.save(typesToInsert);
      }

      return existingTypes;
    } catch (error) {
      return Promise.reject();
    }
  }

  private async createPokemons(types: PokemonType[]) {
    const existingPokemons = await this.pokemonRepository.find();
    const existingPokemonNames = existingPokemons.map((pokemon: Pokemon) => pokemon.name);

    const pokemonsToInsert = pokedexFile.reduce((result: Pokemon[], pokemon: IPokemonFromJSON) => {
      if (existingPokemonNames.indexOf(pokemon.name.english) < 0) {
        result.push(this.createPokemonFromJSON(pokemon, types));
      }

      return result;
    }, []);

    try {
      return this.pokemonRepository.save(pokemonsToInsert);
    } catch (error) {
      return Promise.reject();
    }
  }

  private createPokemonFromJSON(pokemon: IPokemonFromJSON, types: PokemonType[]) {
    const { type: typesOnJSON, id, name: { english: englishName } } = pokemon;
    const typesForPokemon = types.filter((pokemonType: PokemonType) => typesOnJSON.indexOf(pokemonType.name) >= 0);

    return this.pokemonRepository.create({
      name: englishName,
      number: id,
      pokemonTypes: typesForPokemon,
    });
  }

  private getTypesFromJSON(): string[] {
    const allTypes: string[] = [];

    pokedexFile.forEach((pokemon: IPokemonFromJSON) => {
      const { type: types } = pokemon;

      types.forEach((pokemonType: string) => {
        if (allTypes.indexOf(pokemonType) < 0) {
          allTypes.push(pokemonType);
        }
      });
    });

    return allTypes;
  }
}
