export interface Work {
    id: string;
    title: string;
    genre: string;
    authorId: string;
    author: {
        id: string;
        name: string;
    };
    createdAt: string;
    updatedAt: string;
}
