import { Controller, Delete, Get, Post, Put } from '@nestjs/common';

@Controller({
	version: '1',
	path: 'pill-manage',
})
export class PillManageController {
	@Get('/')
	getAllPill() {
		return 'pill';
	}
    @Get('/:id')
    getOnePill() {
		return 'pill';
	}
    @Post()
    addPill(){
        
    }
    @Put('/:id')
    putPill(){

    }
    @Delete('/:id')
    deletePill(){

    }
}
