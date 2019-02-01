import { Field, InputType } from "type-graphql";

import { Pokemon } from "./Pokemon";

@InputType()
export class PokemonInput implements Partial<Pokemon> {
  @Field()
  public name: string;

  @Field({ nullable: true })
  public number?: number;
}
