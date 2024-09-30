//lay nhung cai can cua user
export interface User{
    id: number;
    fullname: string;
    email: string;
    phone: string;
    role: "MANAGER" | "CSTASFF" | "SSTAFF" | "CUSTOMER";
}

