import {IsEmail, IsNotEmpty, MinLength} from "class-validator";

export class SignupDto {
    @IsNotEmpty(({message: 'Username is a required field'}))
    @MinLength(3, {message: 'Username should have a minimum length of $constraint1'})
    username: string;
    @IsNotEmpty({message: 'Email is a required field'})
    @IsEmail({}, {message: 'Email must be valid email'})
    email: string;
    @IsNotEmpty({message: 'Password is a required field'})
    @MinLength(4, {message: 'Username should have a minimum length of $constraint1'})
    password: string;
}

/*
export const SignupValidationSchema = Joi.object({
    username: Joi.string().alphanum().min(3).required().messages({
        'any.required': `Username is a required field`,
        'string.alphanum': 'Username must only contain alpha-numeric characters',
        'string.min': `Username should have a minimum length of {#limit}`,
    }),
    email: Joi.string().email().required().messages({
        'any.required': `Email is a required field`,
        'string.email': `Email must be valid email`,
    }),
    password: Joi.string().min(4).required().messages({
        'any.required': `Password is a required field`,
        'string.min': `Password should have a minimum length of {#limit}`,
    }),
    passwordConfirm: Joi.string().equal(Joi.ref('password')).required().messages({
        "any.only": "The two passwords do not match",
        "any.required": "Please re-enter the password",
    })

}).options({
    abortEarly: false,
});


 */