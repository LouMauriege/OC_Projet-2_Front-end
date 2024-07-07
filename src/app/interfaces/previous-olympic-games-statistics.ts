import { PreviousOlympicGamesParticipations } from "./previous-olympic-games-participations"

export interface PreviousOlympicGamesStatistics {
    id: number,
    country: string,
    participations: Array<PreviousOlympicGamesParticipations>
}
