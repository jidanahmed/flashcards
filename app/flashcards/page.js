'use client'
import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import {
    Container,
    Typography,
    Box,
    AppBar,
    Toolbar,
    Grid,
    Card, 
    CardActionArea,
    CardContent,
} from '@mui/material'
import { collection, doc, getDoc, setDoc } from 'firebase/firestore'
import db from '@/firebase'
import { useRouter } from 'next/navigation'

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const router = useRouter()

    useEffect(() => {
        async function getFlashcards() {
            if (!user) return
            const docRef = doc(collection(db, 'users'), user.id)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                const collections = docSnap.data().flashcardSets || []             // changing .flashcards to .flashcardSets
                console.log("Fetched flashcard sets:", collections)                             // from video and ai
                setFlashcards(collections)
            } else {
                await setDoc(docRef, { flashcards: [] })
                console.log("No flashcard sets found in the document")
            }
        }
        getFlashcards()
    }, [user])

    if (!isLoaded || !isSignedIn) {
        return (
            <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="h6">
                    Please sign in to access flashcard sets. Thanks.
                </Typography>
                <Typography variant="subtitle1">
                    - Jidan
                </Typography>
            </Box>
        );
    }

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`)
    }

    return (
        <Container maxWidth="md">

            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        Flashcards
                    </Typography>
                </Toolbar>
            </AppBar>


            {flashcards.length > 0 ? (
                <Grid container spacing={3} sx={{ mt: 4 }}>
                    {flashcards.map((flashcard, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card>
                                <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                                    <CardContent>
                                        <Typography variant="h5" component="div">
                                            {flashcard.name}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="h6" sx={{ mt: 4, textAlign: 'center' }}>
                    No flashcard sets available. Create some to get started!
                </Typography>
            )}
        </Container>
    )
}