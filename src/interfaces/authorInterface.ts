export interface Author {
    id: string;
    name: string;
    biography: string;
    works?: Work[];
}

export interface Work {
    id: string;
    title: string;
    genre: string;
}
