export interface Work {
    id: string;
    title: string;
    genre: string;
    authorId: string;
    links: string[];
    author: {
        id: string;
        name: string;
    };
    createdAt: string;
    updatedAt: string;
}
