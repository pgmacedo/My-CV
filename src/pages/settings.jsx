import { Container, Typography } from "@mui/material";

export default function Settings() {
  return (
    <Container sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h3" gutterBottom>
        Settings
      </Typography>
      <Typography variant="body1" color="text.secondary">
        This are the settings page for my website.
      </Typography>
    </Container>
  );
}
