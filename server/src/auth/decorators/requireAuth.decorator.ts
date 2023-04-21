import {SetMetadata} from '@nestjs/common';

export const requireAuth = () => SetMetadata('requireAuth', true);