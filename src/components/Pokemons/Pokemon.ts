import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { PokemonType } from "../PokemonTypes/PokemonType";

@ObjectType()
@Entity()
export class Pokemon {
    @Field((type) => ID)
    @PrimaryGeneratedColumn()
    public id: number;

    @Field({ nullable: true })
    @Column({ nullable: true, unique: true })
    public number: number;

    @Field()
    @Column({ unique: true })
    public name: string;

    @Field((type) => [PokemonType])
    @ManyToMany((type) => PokemonType, (pokemonType) => pokemonType.pokemons)
    @JoinTable()
    public pokemonTypes: PokemonType[];
}
