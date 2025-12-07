export interface User {
    username: string;
    name: string;
}

export interface LoginResponse {
    success: boolean;
    token: string;
    user: User;
    error?: string;
}

export interface DashboardData {
    summary: string;
    source: string;
    technical: string;
    user: User;
    database: string;
}
