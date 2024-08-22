'use client';
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button, Container, Typography, Box, Grid, Stack, AppBar, Toolbar, Paper } from "@mui/material";


export default function Home() {
  // Stripe Integration function
  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_sessions', {
      method: 'POST',
      headers: { origin: 'http://localhost:3000' },
    })
    const checkoutSessionJson = await checkoutSession.json()

    const stripe = await getStripe()
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })

    if (error) {
      console.warn(error.message)
    }
  }

  return (
    <main>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Flashcard SaaS
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">Login</Button>
            <Button color="inherit" href="/sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to Jidan's Flashcard SaaS!
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            The easiest way to create flashcards from your text.
          </Typography>
          <Button variant="contained" color="primary" sx={{ mt: 2, mr: 2 }} href="/generate">
            Generate
          </Button>
          <Button variant="outlined" color="primary" sx={{ mt: 2 }} href="/flashcards">
            Flashcards
          </Button>
        </Box>

        <Box sx={{ my: 6 }}>
          <Typography variant="h4" component="h2" gutterBottom>Features</Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6">AI-Powered Flashcard Generation</Typography>
                <Typography>Create flashcards instantly from any text using advanced AI technology.</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6">Customizable Decks</Typography>
                <Typography>Organize and customize your flashcard decks for efficient studying.</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6">Progress Tracking</Typography>
                <Typography>Monitor your learning progress with built-in tracking and analytics. (maybe one day...)</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>


        <Box sx={{ my: 6, textAlign: 'center' }}>
          <Typography variant="h4" component="h2" gutterBottom>Pricing</Typography>
          <Grid container spacing={4} justifyContent="center">
            {/* Basic Plan */}
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>Basic Plan</Typography>
                <Typography variant="h4">$9.99/month</Typography>
                <Button variant="contained" color="primary" onClick={() => handleSubmit('price_basic_id')} sx={{ mt: 2 }}>
                  Subscribe
                </Button>
              </Paper>
            </Grid>
            {/* Pro Plan */}
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>Pro Plan</Typography>
                <Typography variant="h4">$19.99/month</Typography>
                <Button variant="contained" color="primary" onClick={() => handleSubmit('price_pro_id')} sx={{ mt: 2 }}>
                  Subscribe
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </main>
  );
}
