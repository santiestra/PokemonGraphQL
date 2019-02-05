import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Pokemon } from "../Pokemons/Pokemon";

@ObjectType()
@Entity()
export class PokemonType {
    @Field((type) => ID)
    @PrimaryGeneratedColumn()
    public id: number;

    @Field()
    @Column({ unique: true })
    public name: string;

    @ManyToMany((type) => Pokemon, (pokemon) => pokemon.pokemonTypes)
    public pokemons: Pokemon[];
}
