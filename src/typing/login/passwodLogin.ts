export interface LoginPasswordRequest {
    username: string;
    password: string;
}

export interface LoginPasswordResponse {
    token: string
    username: string
    id: string
    mobile: string
    identityCard: string,
    imageUrl: string
}