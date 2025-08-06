import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('MoviesController (e2e) - /maxMinWinIntervalForProducers', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('deve retornar os produtores com maior e menor intervalo entre vitórias', async () => {
        const response = await request(app.getHttpServer())
        .get('/maxMinWinIntervalForProducers')
        .expect(200);

        const body = response.body;

        expect(body).toHaveProperty('min');
        expect(body).toHaveProperty('max');
        expect(Array.isArray(body.min)).toBe(true);
        expect(Array.isArray(body.max)).toBe(true);

        for (const item of [...body.min, ...body.max] ) {
            expect(item).toHaveProperty('producer');
            expect(item).toHaveProperty('interval');
            expect(item).toHaveProperty('previousWin');
            expect(item).toHaveProperty('nextWin');
            expect(typeof item.producer).toBe('string');
            expect(typeof item.interval).toBe('number');
        }
    });

    it('deve retornar os anos com mais de um vencedor', async () => {
        const response = await request(app.getHttpServer())
        .get('/yearsWithMultipleWinners')
        .expect(200);

        const body = response.body;

        expect(body).toHaveProperty('years');
        expect(Array.isArray(body.years)).toBe(true);

        for (const year of body.years) {
            expect(year).toHaveProperty('year');
            expect(year).toHaveProperty('winnerCount');
            expect(typeof year.year).toBe('number');
            expect(typeof year.winnerCount).toBe('number');
            expect(year.winnerCount).toBeGreaterThan(1);
        }
    })

    it('deve retornar os 3 estúdios com mais vitórias', async () => {
        const response = await request(app.getHttpServer())
        .get('/studiosWithWinCount')
        .expect(200);

        const body = response.body;

        expect(body).toHaveProperty('studios');
        expect(Array.isArray(body.studios)).toBe(true);
        expect(body.studios.length).toBeLessThanOrEqual(3);

        for (const studio of body.studios) {
            expect(studio).toHaveProperty('name');
            expect(studio).toHaveProperty('winCount');
            expect(typeof studio.name).toBe('string');
            expect(typeof studio.winCount).toBe('number');
        }
    })

    it('deve retornar apenas vencedores de um determinado ano', async () => {
        const testYear = 1986;

        const response = await request(app.getHttpServer())
        .get(`/winnersByYear?year=${testYear}`)
        .expect(200);

        const body = response.body;

        expect(Array.isArray(body)).toBe(true);

        for (const movie of body) {
            expect(movie).toHaveProperty('id');
            expect(movie).toHaveProperty('title');
            expect(movie).toHaveProperty('year');
            expect(movie).toHaveProperty('studios');
            expect(movie).toHaveProperty('producers');
            expect(movie).toHaveProperty('winner');
            expect(movie.year).toBe(testYear);
            expect(movie.winner).toBe(true);
        }
    })

    afterAll(async () => {
        await app.close();
    });

});


