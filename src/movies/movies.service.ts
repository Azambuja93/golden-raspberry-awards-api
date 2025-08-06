import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './movie.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import * as csvParser from 'csv-parser';
import { WinIntervalResponse, ProducerWinInterval } from './dto/win-interval.dto';
import { YearWithMultiplesWinnersResponse } from './dto/years-with-multiple-winners.dto';
import { StudiosWithWinCountResponse } from './dto/studios-with-win-count.dto';

@Injectable()
export class MoviesService implements OnModuleInit {
    constructor(
        @InjectRepository(Movie)
        private readonly movieRepository: Repository<Movie>,
    ) {}

async onModuleInit () {
    const filePath = path.resolve(__dirname, '..','..','MovieList.csv');
    const stream = fs.createReadStream(filePath).pipe(csvParser({ separator: ';' }));

    let moviesCount = 0;

    for await (const row of stream) {
        const movie = new Movie();
        movie.year = parseInt(row.year);
        movie.title = row.title;
        movie.studios = row.studios?.split(',').map(s => s.trim());
        movie.producers = row.producers?.split(/,| and /).map(p => p.trim());
        movie.winner = row.winner?.toLowerCase() === 'yes';

        await this.movieRepository.save(movie);
        moviesCount++;
    }
        console.log(`${moviesCount} filmes carregados do CSV para o banco em memória`);
    }

async getWinIntervals(): Promise<WinIntervalResponse> {
    const winners = await this.movieRepository.find({
        where: { winner: true },
    });

    const producerWinsMap = new Map<string, number[]>();

    for (const movie of winners) {
        for (const producer of movie.producers || []) {
            if (!producerWinsMap.has(producer)) {
                producerWinsMap.set(producer, []);
            }
        producerWinsMap.get(producer).push(movie.year);
        }
    }

    const intervals: ProducerWinInterval[] = [];

    for (const [producer, years] of producerWinsMap.entries()) {
        const sortedYears = years.sort((a, b) => a - b);
        for (let i = 1; i < sortedYears.length; i++) {
            intervals.push({
                producer,
                interval: sortedYears[i] - sortedYears[i - 1],
                previousWin: sortedYears[i - 1],
                nextWin: sortedYears[i],
            });
        }
    }

    const minInterval = Math.min(...intervals.map(i => i.interval));
    const maxInterval = Math.max(...intervals.map(i => i.interval));

    return {
        min: intervals.filter(i => i.interval === minInterval),
        max: intervals.filter(i => i.interval === maxInterval),
    };
}

async getYearsWithMultipleWinners(): Promise<YearWithMultiplesWinnersResponse> {
    const winners = await this.movieRepository.find({ where: { winner: true} });

    const yearCountMap = new Map<number, number>();

    for (const movie of winners) {
        const count = yearCountMap.get(movie.year) || 0;
        yearCountMap.set(movie.year, count + 1);
    }

    const years = Array.from(yearCountMap.entries())
    .filter(([, count ]) => count > 1)
    .map(([year, count]) =>  ({
        year,
        winnerCount: count,
    }))
    .sort((a, b) => a.year - b.year);

    return { years };
}

async getStudiosWithWinCount(): Promise<StudiosWithWinCountResponse> {
    const winners = await this.movieRepository.find({ where: { winner: true }});
    
    const studioCountMap = new Map<string, number>();

    for (const movie of winners) {
        for (const studio of movie.studios || []) {
            const count = studioCountMap.get(studio) || 0;
            studioCountMap.set(studio, count + 1);
        }
    }

    const studios = Array.from(studioCountMap.entries())
    .map(([name, winCount]) => ({ name, winCount }))
    .sort((a, b) => b.winCount - a.winCount)
    .slice(0, 3);

    return { studios }
}

async getWinnersByYear(year: number): Promise<Movie[]> {
    return this.movieRepository.find({
        where: {
            year,
            winner: true,
        },
    });
}

}




