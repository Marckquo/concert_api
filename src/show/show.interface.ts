import { Admin } from "src/admin/admin.entity"

export interface IShow {
    id?: string
    title: string,
    artist: string,
    capacity: number,
    date: Date,
    place: string,
    priceTezos: number,
    contractAddress?: string,
}
