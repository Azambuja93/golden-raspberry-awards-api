import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Movie {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    year: number;

    @Column()
    title: string;

    @Column("simple-array", {nullable: true})
    studios: string[];

    @Column("simple-array", {nullable: true})
    producers: string[];

    @Column({ default: false})
    winner: boolean;
}