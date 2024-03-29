import { Box, Stack, Container } from "@mantine/core";
import {
  DeleteAccountField,
  UsernameField,
  PasswordField,
  PrefferedColorField,
} from "../components/settingspage";
import DividerTitle from "../components/universal/DividerTitle";

export default function SettingsPage() {
  return (
    <Container fluid>
      <DividerTitle name="Settings"/>
      <Box style={{ maxWidth: "700px" }}>
        <Stack m={5}>
          <UsernameField />
          <PasswordField />
          <PrefferedColorField />
          <DeleteAccountField />
        </Stack>
      </Box>
    </Container>
  );
}
