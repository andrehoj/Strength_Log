import { useState } from "react";
import TemplateMenu from "./TemplateMenu";
import {
  Text,
  Card,
  Flex,
  Modal,
  Button,
  Stack,
  useMantineTheme,
} from "@mantine/core";
import classes from "./css/homepage.module.css";
import { TemplateDrawer } from "./index";
import { TemplateShape } from "../../types/template";

interface Props {
  template: TemplateShape;
  handleTemplateDelete: (templateID: string, templateName: string) => void;
}

export default function TemplateCard({
  template,
  handleTemplateDelete,
}: Props) {
  const { primaryColor } = useMantineTheme();
  const [opened, setOpened] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <Card
        className={classes.card}
        withBorder
        padding="md"
        onClick={() => setOpened(!opened)}
      >
        <Flex justify="space-between" align="center" mb={10}>
          <Text lineClamp={1} size="xl" fw={800} tt="capitalize">
            {template.templateName}
          </Text>
          <TemplateMenu template={template} setModalOpen={setModalOpen} />
        </Flex>
        <Text c="dimmed" lineClamp={1}>
          {template.exercises.map((exercise, i) => (
            <Text
              tt="capitalize"
              c={`${primaryColor}.4`}
              span
              key={exercise.exercise._id}
            >
              {template.exercises.length - 1 === i
                ? exercise.exercise.exerciseName
                : exercise.exercise.exerciseName + ", "}
            </Text>
          ))}
        </Text>
      </Card>

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(!modalOpen)}
        title="Delete Template"
      >
        <Stack>
          <Text>
            Are you sure you want to delete{" "}
            <Text span fw={600} size="md">
              {template.templateName}
            </Text>
            ?
          </Text>
          <Button
            onClick={() =>
              handleTemplateDelete(template._id, template.templateName)
            }
            color="red.5"
          >
            Yes delete it
          </Button>
        </Stack>
      </Modal>

      <TemplateDrawer
        template={template}
        opened={opened}
        setOpened={setOpened}
      />
    </>
  );
}
