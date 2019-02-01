import { Arg, Int, Query, Resolver } from "type-graphql";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";

import { Type } from "./Type";

@Resolver((of) => Type)
export class TypeResolver {
  constructor(
    @InjectRepository(Type) private readonly typeRepository: Repository<Type>,
  ) {}

  @Query((returns) => Type, { nullable: true })
  public type(@Arg("typeId", (type) => Int) typeId: number): Promise<Type> {
    return this.typeRepository.findOne(typeId);
  }

 @Query((returns) => [Type])
  public types(): Promise<Type[]> {
    return this.typeRepository.find();
  }
}
