export interface User {
    id: string
    email: string
    name?: string
    phone?: string
}

export interface LoginResponse {
    user: User
    token: string
}
