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
  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
    Paulo Macedo is a Senior Outsystems developer and technical lead with
    extensive experience in the banking, pharmaceutical, and aerospace
    industries. He holds a Master’s degree in Aerospace Engineering from
    Instituto Superior Técnico and has worked on high‑impact projects such as
    the ISTsat‑1 CubeSat and Outsystems solutions for banking clients. His
    interests include trekking, theater, and exploring emerging software
    technologies.
  </Typography>
  <Button
    onClick={() => window.location = 'mailto:paulogranjamacedo@gmail.com'}
    sx={{ mt: 3 }}
    variant="contained"
  >
    Contact Me
  </Button>
</Container>
  );
}
