export type CreateUserType = {
    readonly  username: string;
    readonly  email: string;
    readonly  slug: string;
    readonly  password: string;
    readonly  firstname?: string;
    readonly  lastname?: string;
    readonly  birthday?: string;
    readonly  gender?: string;
    readonly  activationToken?: string;
}

export type CreateUserOptions = {
    readonly createActivated: boolean;
}