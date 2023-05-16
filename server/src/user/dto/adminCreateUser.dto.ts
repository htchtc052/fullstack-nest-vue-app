import {SignUpDto} from "../../auth/dto/signUp.dto";
import {OmitType} from "@nestjs/swagger";

export class AdminCreateUserDto extends OmitType(SignUpDto, ['passwordConfirm'] as const) {
}