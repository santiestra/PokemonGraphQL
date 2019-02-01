import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Pokemon } from "../Pokemons/Pokemon";

@ObjectType()
@Entity()
export class Type {
    @Field((type) => ID)
    @PrimaryGeneratedColumn()
    public id: number;

    @Field()
    @Column({ unique: true })
    public name: string;

    @Field((type) => [Pokemon])
    @OneToMany((type) => Pokemon, (pokemon) => pokemon.type)
    public pokemons: Pokemon[];
}
