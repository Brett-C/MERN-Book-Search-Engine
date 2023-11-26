import { useState, useEffect } from 'react';
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

import { useQuery, useMutation } from '@apollo/client';
import { REMOVE_BOOK } from '../utils/mutations';
import { GET_ME } from '../utils/queries.js';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import { gql } from 'graphql-tag'



const SavedBooks = () => {
  const [userData, setUserData] = useState({});
  const [removeBook] = useMutation(REMOVE_BOOK);
  const token = Auth.loggedIn() ? Auth.getToken(): null;

  // use this to determine if `useEffect()` hook needs to run again
  const userDataLength = Object.keys(userData).length;

  const { data, error } = useQuery(gql`
         query me {
          me {
              _id
              username
              email
              bookCount
              savedBooks {
                  bookId
                  authors
                  description
                  title
                  image
                  link
              }
          }
      }
         `);

         useEffect(() => {
          console.log('Data:', data);
          if (data) {
            if (error) {
              console.error(error);
            } else {
              const newUser = data.me || {};
              setUserData(newUser);
            }
          }
        }, [data, error, token]);
    
    

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const response = await removeBook({
        variables: { bookId },
        refetchQueries: [{ query: GET_ME }],
      })

      if (!response.errors) {
        throw new Error(response.errors[0].message);
      }

      const updatedUser = await response.json();
      setUserData(updatedUser);
      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err.message);
    }
  };

  // if data isn't here yet, say so
  if (!userDataLength) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md="4">
                <Card key={book.bookId} border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
