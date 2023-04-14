import { Controller, Post, UseGuards, Req, Body, Get, Param, NotFoundException, Put, Delete } from '@nestjs/common';
import { AdminGuard } from '../auth/admin.guard';
import { IShow } from '../show/show.interface';
import { ShowService } from './show.service';
import { AuthService } from 'src/auth/auth.service';

@Controller('show')
export class ShowController {
    constructor(private readonly showService: ShowService, private readonly authService: AuthService) { }

    @UseGuards(AdminGuard)
    @Post()
    createShow(@Body() iShow: IShow, @Req() request): Promise<IShow> {
        const walletAddress = request.walletAddress;
        return this.showService.createShow(walletAddress, iShow);
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

    @Get()
    getShows(): Promise<IShow[]> {
        return this.showService.getShows();
    }

    @UseGuards(AdminGuard)
    @Delete(':id')
    async deleteShow(@Param('id') id: string, @Req() request): Promise<string> {
        const walletAddress = request.walletAddress;
        await this.authService.canWriteShow(walletAddress, id);
        return this.showService.deleteShow(id);
    }

    @UseGuards(AdminGuard)
    @Put(':id')
    async updateShow(@Param('id') id: string, @Body() iShow: IShow, @Req() request): Promise<IShow> {
        const walletAddress = request.walletAddress;
        await this.authService.canWriteShow(walletAddress, id);
        return this.showService.editShow(id, iShow);
    }
}
