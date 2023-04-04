import {IsEmail, IsNotEmpty, MinLength, Validate} from "class-validator";
import {IsEmailAllreadyExists} from "../../users/validators/isEmailAllreadyExists";

export class SignupDto {
    @IsNotEmpty(({message: 'Username is a required field'}))
    @MinLength(3, {message: 'Username should have a minimum length of $constraint1'})
    username: string;
    @IsNotEmpty({message: 'Email is a required field'})
    @IsEmail({}, {message: 'Email must be valid email'})
    @Validate(IsEmailAllreadyExists, {message: 'Email $value allready exists'})
    email: string;
    @IsNotEmpty({message: 'Password is a required field'})
    @MinLength(4, {message: 'Username should have a minimum length of $constraint1'})
    password: string;
}
