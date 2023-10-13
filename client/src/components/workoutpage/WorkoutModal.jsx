import {
  Stack,
  Modal,
  Title,
  ActionIcon,
  Menu,
  Button,
  RingProgress,
  Group,
  Text,
  NumberInput,
} from "@mantine/core";

import { IoIosOptions } from "react-icons/io";
import { BsPlus } from "react-icons/bs";
import { useState } from "react";
import Resting from "./Resting";

export default function WorkoutModal({
  opened,
  close,
  exercise,
  templateName,
  handleChange,
  exerciseIndex,
  exerciseComplete,
}) {
  const [currentSet, setCurrentSet] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [setDone, setSetDone] = useState(false);

  function handleSetFinished() {
    if (currentSet != exercise.sets.length - 1) {
      setIsResting(true);
    } else {
      setSetDone(true);
    }
  }

  function handleContinue() {
    setCurrentSet(currentSet + 1);
    setIsResting(false);
  }

  return (
    <Modal
      withCloseButton={false}
      fullScreen
      transitionProps={{ transition: "slide-up" }}
      opened={opened}
      onClose={close}
    >
      <Group position="apart">
        <Title
          tt="capitalize"
          component="span"
          variant="gradient"
          gradient={{ from: "#662D8C", to: " #ED1E79", deg: 90 }}
        >
          {templateName}
        </Title>
        <Button onClick={close}>Stop Exercise</Button>
      </Group>
      <Stack align="center" spacing={5} justify="center">
        <Title
          tt="capitalize"
          order={2}
          sx={(theme) => ({ color: theme.colors.brand[4] })}
          mt={5}
        >
          {exercise.exercise.exerciseName}
        </Title>

        {setDone ? (
          <>
            <Text
              fw={500}
              size="xl"
              sx={(theme) => ({ color: theme.colors.green[5] })}
            >
              {`${exercise.sets.length} / ${exercise.sets.length}`} Sets
              Completed
            </Text>
            <Button size="md" w={175} p={0} leftIcon={<BsPlus size={20} />}>
              One More Set?
            </Button>
            <Button
              size="md"
              color="green"
              w={175}
              onClick={() => {
                close();
                exerciseComplete(exerciseIndex);
              }}
            >
              Exercise Done
            </Button>
          </>
        ) : (
          <>
            <Text c="dimmed">{`Set ${currentSet + 1} / ${
              exercise.sets.length
            }`}</Text>

            {isResting ? (
              <Resting
                setIsResting={setIsResting}
                handleContinue={handleContinue}
                restTime={exercise.restTime}
              />
            ) : (
              <>
                <Group justify="center" gap="xs" grow w="250px">
                  <NumberInput
                    ta="center"
                    label={<Text>Reps</Text>}
                    value={exercise.sets[currentSet].reps}
                    onChange={(value) =>
                      handleChange(value, exerciseIndex, "reps", currentSet)
                    }
                  />

                  <NumberInput
                    ta="center"
                    step={5}
                    label={<Text>Weight (Lbs)</Text>}
                    value={exercise.sets[currentSet].weight}
                    onChange={(value) =>
                      handleChange(value, exerciseIndex, "weight", currentSet)
                    }
                  />
                </Group>
                <Button mt="md" onClick={handleSetFinished}>
                  Set Done
                </Button>
              </>
            )}
          </>
        )}
      </Stack>
    </Modal>
  );
}
