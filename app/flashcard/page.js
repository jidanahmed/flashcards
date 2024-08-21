'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardActionArea,
  CardContent,
} from '@mui/material'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import db from '@/firebase'

import { useSearchParams } from 'next/navigation'

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState([])

  const searchParams = useSearchParams()
  const search = searchParams.get('id')

  useEffect(() => {
    async function getFlashcard() {
      if (!search || !user) return

      console.log('Fetching flashcards with ID:', search);                       // from ai

      // const colRef = collection(doc(collection(db, 'users'), user.id), search, ) 
      const colRef = collection(doc(collection(db, 'users'), user.id), search, ) 

      console.log('colRef is:', colRef);                                                            // from me
      console.log('await getDocs colRef is:', await getDocs(colRef));                               // from me

      const docs = await getDocs(colRef)
      const flashcards = []
      docs.forEach((doc) => {
        flashcards.push({ id: doc.id, ...doc.data() })
      })

      console.log('Fetched flashcards:', flashcards);                             // from ai

      setFlashcards(flashcards)
    }
    getFlashcard()
  }, [search, user])

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  if (!isLoaded || !isSignedIn) {
    return (
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6">
          Please sign in to view this flashcard. Thanks.
        </Typography>
        <Typography variant="subtitle1">
          - Jidan
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="md">

      <Grid container spacing={3} sx={{ mt: 4 }}>
        {flashcards.map((flashcard) => (
          <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
            <Card>
              <CardActionArea onClick={() => handleCardClick(flashcard.id)}>
                <CardContent>
                  <Box sx={{ /* Styling for flip animation */ }}>
                    <div>
                      <div>
                        <Typography variant="h5" component="div">
                          {flashcard.front}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="h5" component="div">
                          {flashcard.back}
                        </Typography>
                      </div>
                    </div>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}