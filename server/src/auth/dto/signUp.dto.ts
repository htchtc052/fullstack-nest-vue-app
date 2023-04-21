import {IsEmail, IsNotEmpty, Validate} from "class-validator";
import {IsEmailAllreadyExists} from "../../user/validators/isEmailAllreadyExists";
import {ApiProperty} from "@nestjs/swagger";
import {Match} from "../../common/match.decorator";
import {i18nValidationMessage} from "nestjs-i18n";
import {MinLengthCustom} from "../../common/minLengthCustom.decorator";

export class SignUpDto {
    @ApiProperty({
        name: "User name",
        description: 'User name descr',
    })
    @IsNotEmpty({message: i18nValidationMessage('validation.USERNAME_NOT_EMPTY')})
    username: string;

    @ApiProperty({
        description: 'User email',
    })

    @IsNotEmpty({message: i18nValidationMessage('validation.EMAIL_NOT_EMPTY')})
    @IsEmail({}, {message: i18nValidationMessage('validation.EMAIL_INVALID')})
    @Validate(IsEmailAllreadyExists, {message: i18nValidationMessage('validation.EMAIL_BUSY')})
    email: string;

    @IsNotEmpty({message: i18nValidationMessage('validation.SLUG_NOT_EMPTY')})
    //toDo validate slug format
    @Validate(IsEmailAllreadyExists, {message: i18nValidationMessage('validation.SLUG_BUSY')})
    slug: string;


    @ApiProperty({
        description: 'User password',
    })
    @IsNotEmpty({message: i18nValidationMessage('validation.PASSWORD_NOT_EMPTY')})
    @MinLengthCustom(4, {message: i18nValidationMessage('validation.PASSWORD_MIN', {count: 4})})
    password: string;


    @ApiProperty({description: 'Password confirmation'})
    @IsNotEmpty({message: i18nValidationMessage('validation.PASSWORD_CONFIRM_NOT_EMPTY')})
    @Match(SignUpDto, (s: SignUpDto) => s.password, {message: i18nValidationMessage('validation.PASSWORD_CONFIRM_NOT_MATCH')})
    passwordConfirm: string;
}