'use client'

import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  Card,
  CardContent,
  CardActionArea,
} from '@mui/material'
import { doc, collection, getDoc, getDocs, writeBatch } from "firebase/firestore";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import db from "@/firebase";

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState([])
  const searchParams = useSearchParams()
  const search = searchParams.get('id')               // gets the thing from the url, like Minecraft or Bangladesh

  useEffect(() => {
    async function getFlashcard() {
      if (!search || !user) return;

      const setDocRef = doc(collection(doc(collection(db, 'users'), user.id), 'flashcardSets'), search);
      const setDocSnap = await getDoc(setDocRef);

      if (setDocSnap.exists()) {
        const data = setDocSnap.data();
        setFlashcards(data.flashcards || []);
        setFlipped(Array(data.flashcards.length).fill(false));
      }
    }
    getFlashcard();
  }, [search, user]);

  const handleCardClick = (index) => {
    setFlipped(prev => {
      const newFlipped = [...prev];
      newFlipped[index] = !newFlipped[index];
      return newFlipped;
    })
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
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Flashcard Set: {search}
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {flashcards.map((flashcard, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ backgroundColor: flipped[index] ? '#e0e0e0' : 'white' }}>
              <CardActionArea onClick={() => handleCardClick(index)}>
                <CardContent>
                  <Box sx={{ minHeight: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="h6">
                      {flipped[index] ? flashcard.back : flashcard.front}
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}