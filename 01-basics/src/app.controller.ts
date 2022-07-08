import { Controller, Get } from '@nestjs/common';

@Controller('/app')
export class AppController {
	@Get('/hi')
	getRootRoute() {
		return 'Hi there!';
	}

	@Get('/bye')
	getByeThere() {
		return 'Bye there!';
	}
}
                Thanks for installing Nest 🙏
                                                                             Please consider donating to our open collective
                                                                                    to help us maintain this package.
                                                                                                    