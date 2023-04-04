import {
    ArgumentMetadata,
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
    PipeTransform
} from '@nestjs/common';
import {plainToClass} from 'class-transformer';
import {validate} from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value, metadata: ArgumentMetadata) {

        if (!value) {
            throw new BadRequestException('No data submitted');
        }

        const {metatype} = metadata;
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = plainToClass(metatype, value);
        const errors = await validate(object);
        if (errors.length > 0) {
            throw new HttpException({
                message: 'Input data validation failed',
                validationErrors: this.buildError(errors)
            }, HttpStatus.BAD_REQUEST);
        }
        return value;
    }

    private buildError(errors) {

        const errorMessages = [];
        errors.forEach(error => {
            errorMessages.push({[`${error.property}`]: Object.values(error.constraints).join('. ').trim()});
        });
        return errorMessages

    }

    private toValidate(metatype): boolean {
        const types = [String, Boolean, Number, Array, Object];
        return !types.find((type) => metatype === type);
    }
}