import { Controller, Get } from '@nestjs/common';

@Controller({
	version: '1',
	path: 'sample',
})
export class SampleController {
	@Get()
	sample() {
		return 'sample';
	}
}
