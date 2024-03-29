import { NotFoundError } from "../error/NotFoundError";
import { Show, ShowInputDTO, ShowOutputDTO, WeekDay } from "../model/Show";
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
        .into(this.tableNames.shows)
    }
    public async getShowsByTimes(
        weekDay: WeekDay,
        startTime: number,
        endTime: number
    ): Promise<ShowOutputDTO>{
        const shows = await this.getConnection()
        .select("*")
        .where("end_time", ">", `${startTime}`)
        .andWhere("start_time", "<", `${endTime}`)
        .from(this.tableNames.shows)
        
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
    public async getShowsByWeekDayOrFail(weekDay: WeekDay): Promise<ShowOutputDTO[]> {
        const shows = await this.getConnection().raw(
            `
            SELECT show.id,
                   band.id as bandID
                   band.name as bandName,
                   show.start_time as startTime,
                   show.end_time as endTime,
                   show.week_day as weekDay,
                   band.music_genre as musicGenre,
                   FROM ${this.tableNames.shows} show
                   LEFT JOIN ${this.tableNames.bands} band ON band.id = show.band.id
                   WHERE show.week_day = "${weekDay}"
                   ORDER BY startTime ASC
                      `
        )
        if(!shows.length) {
            throw new NotFoundError(`Unable to found shows at ${weekDay}`)
        }
        return shows[0].map((data:any)=>({
            id: data.id,
            bandId: data.bandId,
            startTime: data.startTime,
            endTime: data.endTime,
            weekDay: data.weekDay,
            mainGenre: data.mainGenre
        })

        )
    }
}