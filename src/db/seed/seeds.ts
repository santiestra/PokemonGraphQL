import { Service } from "typedi";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";

import { Pokemon } from "../../components/Pokemons/Pokemon";
import { Type } from "../../components/Types/Type";

const pokedexFile = require("./pokedex.json");

@Service()
export default class Seed {
  @InjectRepository(Pokemon) public pokemonRepository: Repository<Pokemon>;
  @InjectRepository(Type) public typeRepository: Repository<Type>;

  public async run() {
    pokedexFile.forEach(async (pokemon) => {
      const { type: types , id, name: { english: englishName } } = pokemon;
      const type = types[0];

      let savedType = await this.typeRepository.findOne({ name: type });
      if (!savedType) {
        const newType = this.typeRepository.create({ name: type });
        savedType = await this.typeRepository.save(newType);
      }

      let savedPokemon = await this.pokemonRepository.findOne({ name: englishName });
      if (!savedPokemon) {
        const newPokemon = this.pokemonRepository.create({
          name: englishName,
          number: id,
          typeId: savedType.id,
        });

        savedPokemon = await this.pokemonRepository.save(newPokemon);
      }
    });
  }
}
