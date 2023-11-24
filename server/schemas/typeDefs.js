const typeDefs = `
type Query {
    me: User
}

type Auth {
    token: ID!
    user: User
}

type Book {
    bookId: ID
    authors: [String]
    description: String
    title: String
    image: String
    link: String
}

type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
}

type Mutation {
    login(email: String!, password: String!):Auth
    addUser(username: String!, email: String!, passowrd: String!): Auth
    saveBook(bookData: BookInput): User
    removeBook(bookId: ): User

}

input BookInput {
    bookId: ID
    authors: [String]
    description: String
    title: String
    image: String
    link: String
}
`;