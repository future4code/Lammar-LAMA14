import {Request, Response} from "express"
import { Bandbusiness } from "../business/BandBusiness"
import { BandDatabase } from "../data/BandDatabase"
import { BaseDatabase } from "../data/BaseDatabase"
import {BandInputDTO} from "../model/Band"
import { Authenticator } from "../services/Authenticator"
import { IdGenerator } from "../services/IdGenerator"


export class BandController {
    async registerBand(req: Request, res: Response) {
        try {
            const input: BandInputDTO = {
                name: req.body.name,
                mainGenre: req.body.mainGenre,
                responsible: req.body.responsible
            }
            const bandBusiness = new Bandbusiness(
                new BandDatabase,
                new IdGenerator,
                new Authenticator
            )
            await bandBusiness.registerBand(input, req.headers.authorization as string)
            res.sendStatus(200)
        } catch (err) {
            res.status(err.customErrorCode || 400).send({
               message: err.message 
            })
        } finally{
            await BaseDatabase.destroyConnection()
        }
    }
    async getBandDetail(req: Request, res: Response) {
        try {
            const input =(req.query.id ?? req.query.name) as string
            
            const bandBusiness = new Bandbusiness(
                new BandDatabase,
                new IdGenerator,
                new Authenticator
            )
            const band = await bandBusiness.getBandDetailByIdOrName(input)

            res.status(200).send(band)
        } catch (err) {
            res.status(err.customErrorCode || 400).send({
                message: err.message })
        } finally{
            await BaseDatabase.destroyConnection()
        }
    }
}
