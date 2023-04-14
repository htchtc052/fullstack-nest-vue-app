import {Injectable} from "@nestjs/common";
import {MailerService} from "@nestjs-modules/mailer";
import {User} from "../user/schemas/user.schema";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class EmailService {
    constructor(private mailerService: MailerService, private configService: ConfigService) {
    }

    async sendActivationEmail(user: User): Promise<void> {
        const frontendUrl = this.configService.get<string>('FRONTEND_URL');

        const activationLink = `${this.configService.get<string>('BACKEND_URL')}/auth/activate/${user.activationToken}`

        try {
            await this.mailerService
                .sendMail({
                    to: user.email,
                    subject: `Confirm registration on ${frontendUrl}`,
                    template: `account-activation`,
                    context: {
                        activationLink,
                        frontendUrl,
                        username: user.username,
                    },
                })
        } catch (err) {
            console.error(`Error sending signup Email ${err.stack}`)
        }
    }
}
