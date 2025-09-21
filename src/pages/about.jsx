import { Button, Container, Typography } from "@mui/material";

export default function About() {
  return (
    <Container sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h3" gutterBottom>
        Paulo Macedo
      </Typography>
      <Typography variant="body1" color="text.secondary">
        31, living in Lisbon, likes to swim.
      </Typography>
      <Button variant="contained" sx={{ mt: 3 }}>
        Contact Me
      </Button>
    </Container>
  );
}
