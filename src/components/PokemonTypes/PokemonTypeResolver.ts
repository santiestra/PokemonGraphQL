import { Arg, Int, Query, Resolver } from "type-graphql";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";

import { PokemonType } from "./PokemonType";

@Resolver((of) => PokemonType)
export class PokemonTypeResolver {
  constructor(
    @InjectRepository(PokemonType) private readonly typeRepository: Repository<PokemonType>,
  ) {}

  @Query((returns) => PokemonType, { nullable: true })
  public type(@Arg("typeId", (type) => Int) typeId: number): Promise<PokemonType> {
    return this.typeRepository.findOne(typeId);
  }

 @Query((returns) => [PokemonType])
  public types(): Promise<PokemonType[]> {
    return this.typeRepository.find();
  }
}
