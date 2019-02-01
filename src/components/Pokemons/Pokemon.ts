import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Type } from "../Types/Type";

@ObjectType()
@Entity()
export class Pokemon {
    @Field((type) => ID)
    @PrimaryGeneratedColumn()
    public id: number;

    @Field({ nullable: true })
    @Column({ nullable: true })
    public number: number;

    @Field()
    @Column()
    public name: string;

    @Field((type) => Type)
    @ManyToOne((type) => Type, (type) => type.pokemons)
    public type: Type;

    @Field({ nullable: true })
    @Column({ nullable: true })
    public typeId: number;
}
