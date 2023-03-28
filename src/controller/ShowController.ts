import {Request, Response} from "express"
import { BaseDatabase } from "../data/BaseDatabase"
import {Show, ShowInputDTO} from "../model/Show"
import {ShowBusiness} from "..//business/ShowBusiness"
import { ShowDatabase } from "../data/ShowDatabase"
import { BandDatabase } from "../data/BandDatabase"
import { IdGenerator } from "../services/IdGenerator"
import { Authenticator } from "../services/Authenticator"
export class ShowController{
    async createShow(req: Request, res: Response) {
        try {
            const weekDay = Show.toWeekDayEnum(req.body.weekDay)

            const input: ShowInputDTO = {
                weekDay,
                bandId: req.body.bandId,
                startTime: req.body.startTime,
                endTime: req.body.endTime
            }
            const showBusiness = new ShowBusiness(
                new ShowDatabase,
                new BandDatabase,
                new IdGenerator,
                new Authenticator
            )

            await showBusiness.createShow(input, req.headers.authorization as string)

            res.sendStatus(200)

            
        } catch (err) {
           res.status(err.customErrorCode || 400). send({
            message: err.message
           } )
        }finally{
            await BaseDatabase.destroyConnection()
        }
    } 
    async getShowsByWeekDay(req: Request, res: Response) {
        try {
            const weekDay = Show.toWeekDayEnum(req.query.weekDay as string)
            const showBusiness = new ShowBusiness(
                new ShowDatabase,
                new BandDatabase,
                new IdGenerator,
                new Authenticator
            )
            const shows = await ShowBusiness.getShowsByWeekDay(weekDay)
            res.status(200).send({ shows })
        } catch (err) {
            res.status(err.customErrorCode || 400).send({
                message: err.message,
            })
            
        }finally{
            await BaseDatabase.destroyConnection()
        }
}
}