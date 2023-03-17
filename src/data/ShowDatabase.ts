import { Show, ShowOutputDTO, WeekDay } from "../model/Show";
import { BaseDatabase} from "./BaseDatabase"

export class ShowDatabase extends BaseDatabase {
    private static TABLE_NAME = "NOME_TABEELA_SHOWS"

    public async createShow(show: Show): Promise<void>{
        await this.getConnection()
        .insert({
            id: show.getId(),
            band_id: show.getBandId(),
            start_time: show.getStartTime(),
            end_time: show.getEndTime(),
            week_day: show.getWeekDay()
        })
        .into(ShowDatabase.TABLE_NAME)
    }
    public async getShowsByTimes(
        weekDay: WeekDay,
        startTime: number,
        endTime: number
    ): Promise<ShowOutputDTO>{
        const shows = await this.getConnection().raw(
            `
             SELECT show.id as id,
             show.start_time as startTime,
             show.end_time as endTime,
             show.week_day as weekDay,
           FROM ${ShowDatabase.TABLE_NAME} show
           WHERE show.week_day = "${weekDay}"
           AND WHERE show.start_time <= "${endTime}"  
           AND WHERE show.end_time >= "${startTime}"
           ORDER BY startTime ASC
            `
            )

        return shows.map((show: any)=>{
            return {
                id: show.id,
                bandId: show.bandId,
                startTime: shows.startTime,
                endTime: show.endTime,
                weekDay: show.weekDay
            }
        })    
    }
}