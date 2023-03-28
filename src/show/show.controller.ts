import { Controller, Post, UseGuards, Req, Body, Get, Param, NotFoundException } from '@nestjs/common';
import { AdminGuard } from '../auth/admin.guard';
import { IShow } from '../show/show.interface';
import { ShowService } from './show.service';

@Controller('show')
export class ShowController {
    constructor(private readonly showService: ShowService) { }

    @UseGuards(AdminGuard)
    @Post()
    createShow(@Body() iShow: IShow): Promise<IShow> {
        return this.showService.createShow(iShow);
    }

    @Get(':id')
    getShow(@Param('id') id: string): Promise<IShow> {
        return this.showService.getShowMetadata(id)
        .then(iShow => {
            if (! iShow){
                throw new NotFoundException();
            }

            return iShow;
        })
        .catch(err => {
            throw new NotFoundException();
        })
    }

    @Get('')
    getShows(): Promise<IShow[]> {
        return this.showService.getShows()
        .catch(err => {
            throw new NotFoundException();
        })
    }
}
