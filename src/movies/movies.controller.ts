import { Controller, Get, Query} from '@nestjs/common';
import { MoviesService} from './movies.service';
import { WinIntervalResponse} from './dto/win-interval.dto';
import { YearWithMultiplesWinnersResponse } from './dto/years-with-multiple-winners.dto';
import { StudiosWithWinCountResponse } from './dto/studios-with-win-count.dto';
import { Movie } from './movie.entity';

@Controller()
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) {}

    @Get('maxMinWinIntervalForProducers')
    async getWinIntervals(): Promise<WinIntervalResponse> {
        return this.moviesService.getWinIntervals();
    }

    @Get('yearsWithMultipleWinners')
    async getYearsWithMultipleWinners(): Promise<YearWithMultiplesWinnersResponse> {
        return this.moviesService.getYearsWithMultipleWinners();
    }

    @Get('studiosWithWinCount')
    async getStudiosWithWinCount(): Promise<StudiosWithWinCountResponse> {
        return this.moviesService.getStudiosWithWinCount();
    }

    @Get('winnersByYear')
    async getWinnersByYear(@Query('year') year: string): Promise<Movie[]> {
        return this.moviesService.getWinnersByYear(parseInt(year));
    }
}