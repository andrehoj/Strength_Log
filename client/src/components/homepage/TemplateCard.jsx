import { useState } from "react";
import { motion } from "framer-motion";
import { capitalizeFirstLetter } from "../../utils/helpers/functions";
import TemplateMenu from "./TemplateMenu";
import TemplateModal from "./TemplateModal";
import { Text, Card, Flex, Title, createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  card: {
    width: 300,
    overflow: "visible",
    "&:hover": { cursor: "pointer" },
    [theme.fn.smallerThan("sm")]: {
      width: 240,
    },
  },
  exercises: {
    color: theme.colors.violet[5],
  },
}));

const cardAnimation = {
  initial: { scale: 0.9, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
  },
};

export default function TemplateCard({ template, handleTemplateDelete }) {
  const { classes } = useStyles();
  const [opened, setOpened] = useState(false);
  return (
    <>
      <motion.div
        layout
        animate={cardAnimation}
        onClick={() => setOpened(!opened)}
      >
        <Card
          shadow="sm"
          radius="md"
          p="sm"
          withBorder
          className={classes.card}
        >
          <Flex justify="space-between" align="center" mb={10}>
            <Title order={3} span fw={600}>
              {template.templateName.toLocaleUpperCase()}
            </Title>
            <TemplateMenu
              template={template}
              handleTemplateDelete={handleTemplateDelete}
            />
          </Flex>
          <Text lineClamp={1} className={classes.exercises}>
            {template.exercises.map((exercise, i) => (
              <Text component="span" key={exercise.exerciseName}>
                {template.exercises.length - 1 === i
                  ? capitalizeFirstLetter(exercise.exerciseName)
                  : capitalizeFirstLetter(exercise.exerciseName) + ", "}
              </Text>
            ))}
          </Text>
        </Card>
      </motion.div>

      <TemplateModal
        template={template}
        opened={opened}
        setOpened={setOpened}
      />
    </>
  );
}