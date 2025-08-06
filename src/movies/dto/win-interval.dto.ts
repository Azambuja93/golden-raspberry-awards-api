export class ProducerWinInterval {
    producer: string;
    interval: number;
    previousWin: number;
    nextWin: number;
}

export class WinIntervalResponse {
    min: ProducerWinInterval[];
    max: ProducerWinInterval[];
}