import { Button, Container, Typography } from "@mui/material";

export default function About() {
  return (
    <Container sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h3" gutterBottom>
        About Me
      </Typography>
      <Typography variant="body1" color="text.secondary">
        This is the about page for my CV website.
      </Typography>
      <Button variant="contained" sx={{ mt: 3 }}>
        Contact Me
      </Button>
    </Container>
  );
}
