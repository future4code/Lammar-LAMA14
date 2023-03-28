import {Band ,BandInputDTO } from "../model/Band"
import { Authenticator } from "../services/Authenticator"
import { IdGenerator } from "../services/IdGenerator"
import {UnauthorizedError} from "../error/UnauthorizedError"
import {User, UserRole} from "../model/User"
import { InvalidInputError } from "../error/InvalidInputError"
import { BandDatabase } from "../data/BandDatabase"

export class Bandbusiness {
    constructor(
        private bandDatabase: BandDatabase,
        private idGenerator: IdGenerator,
        private authenticator: Authenticator
    ){}
    async registerBand(input: BandInputDTO, token: string) {
        const tokenData = this.authenticator.getData(token)

        
        if(tokenData.role !== UserRole.ADMIN) {
            throw new UnauthorizedError("Only admins can acess this freature")    
        }
        if(!input.name || !input.mainGenre || !input.responsible){
            throw new InvalidInputError("Invalid input to registerBand");
        }
        await this.bandDatabase.createBand(
            Band.toBand({
                ...input,
                id: this.idGenerator.generate()
            })!
        )     

    }
    async getBandDetailByIdOrName(input: string): Promise<Band> {
        if(input){
            throw new InvalidInputError("Invalid input to registerBand")
        }
        return this.bandDatabase.getBandByIdOrNameOrFail(input)
    }
}