import {
  Title,
  Flex,
  Stack,
  Button,
  Text,
  Container,
  Group,
  useMantineTheme,
} from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import { ExerciseCard } from "../components/workoutpage/index";
import { useState, useEffect } from "react";
import { useInterval } from "@mantine/hooks";
import { formatTime } from "../utils/helpers/functions";
import { useMutation } from "@apollo/client";
import { SAVE_WORKOUT } from "../utils/graphql/mutations";
import { useUserInfo } from "../contexts/userInfo";
import { showNotification } from "@mantine/notifications";
import { AiOutlineCheck } from "react-icons/ai";
import { BiErrorCircle } from "react-icons/bi";
import { IconConfetti } from "@tabler/icons-react";
import { ExerciseShape } from "../types/template";
import { Exercise, WorkoutState } from "../types/workoutState";
import { DividerTitle } from "../components/universal";

const startedOn = new Date();

export default function WorkoutPage() {
  const {
    state: { workout },
  } = useLocation();

  const userInfo = useUserInfo();
  const userID = userInfo?.data._id;

  const navigate = useNavigate();
  const { primaryColor } = useMantineTheme();

  const [saveWorkout, { loading }] = useMutation(SAVE_WORKOUT);

  const [workoutState, setWorkoutState] = useState<WorkoutState>({
    ...workout,
    timeToComplete: null,
    workoutFinished: false,
  });

  // const { ms, isRunning, handleStart, handlePause, handleReset } = useMS();

  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [workoutDone, setWorkoutDone] = useState(false);

  const interval = useInterval(() => setSeconds((s) => s + 1), 1000);

  useEffect(() => {
    !workoutDone && interval.start();

    return interval.stop;
  }, [interval, workoutDone]);

  if (!workoutDone) {
    if (seconds >= 60) {
      setSeconds(0);
      setMinutes((m) => m + 1);
    }

    if (minutes >= 60) {
      setMinutes(0);
      setHours((h) => h + 1);
    }
  }

  function handleChange(
    value: number,
    exerciseIndex: number,
    name: "reps" | "weight",
    setIndex: number
  ) {
    const data = { ...workoutState };

    data.exercises[exerciseIndex].sets[setIndex][name] = value;
    data.exercises[exerciseIndex].sets[setIndex][name] = value;

    setWorkoutState(data);
  }

  function addSet(
    exercise: ExerciseShape,
    exerciseIndex: number,
    setIsResting: React.Dispatch<React.SetStateAction<boolean>>,
    setSetDone: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    const data = { ...workoutState };

    // the set to add is just a copy of the last set completed
    const setToAdd = exercise.sets[exercise.sets.length - 1];

    data.exercises[exerciseIndex].completed = false;

    data.exercises[exerciseIndex].sets.push(setToAdd);

    setWorkoutState(data);
    setSetDone(false);
    setIsResting(true);
  }

  function handleExerciseComplete(exerciseIndex: number) {
    const data = { ...workoutState };

    data.exercises[exerciseIndex].completed = true;

    let isWorkoutDone = data.exercises.every((e) => e.completed === true);

    data.workoutFinished = isWorkoutDone;

    if (isWorkoutDone) {
      data.timeToComplete = seconds + minutes * 60 + hours * 3600;
      setWorkoutDone(true);
      interval.stop();
    }
    setWorkoutState(data);
  }

  function handleFinish() {
    saveWorkout({
      variables: {
        templateId: workoutState.templateId,
        userID: userID,
        exercises: workoutState.exercises,
      },
    })
      .then((res) => {
        if (res.data?.saveWorkout.username && !loading) {
          showNotification({
            title: `${res.data.saveWorkout.username} your template was saved!`,
            message: "Your workout will be recorded. 🥳",
            autoClose: 3000,
            icon: <AiOutlineCheck />,
          });
        }
      })
      .catch((error) => {
        showNotification({
          title: `Oops, there was an error while saving your template`,
          message: error.message,
          autoClose: 3000,
          icon: <BiErrorCircle />,
          color: "red",
        });
      });

    navigate("/dashboard");
  }

  return (
    <Container fluid>
      <DividerTitle
        name={
          <Group>
            <Title tt="capitalize">
              <Text fw={800} size="xxl" c={`${primaryColor}.6`} span>
                Training
              </Text>{" "}
              {workoutState.templateName}
            </Title>
          </Group>
        }
      />
      <Stack align={"center"} gap={5}>
        <Text size="xl">Started on</Text>
        <Text
          ta="center"
          c={workoutState.workoutFinished ? "green.5" : undefined}
        >
          {Intl.DateTimeFormat("en-US", {
            weekday: "long",
            month: "long",
            day: "2-digit",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
            year: "numeric",
          }).format(startedOn)}
        </Text>
        <Text
          size="xl"
          mb={15}
          c={workoutState.workoutFinished ? "green.5" : undefined}
        >{`${hours}:${formatTime(minutes)}:${formatTime(seconds)}`}</Text>
        {workoutState.workoutFinished ? (
          <>
            <Group gap={5}>
              Workout Completed! <IconConfetti />
            </Group>

            <Button mt={10} color="green.5" onClick={handleFinish}>
              Finish and save
            </Button>
          </>
        ) : (
          <Flex direction="column" gap={15}>
            {workoutState.exercises.map(
              (exercise: Exercise, exerciseIndex: number) => (
                <ExerciseCard
                  exerciseIndex={exerciseIndex}
                  workoutState={workoutState}
                  exercise={exercise}
                  key={exercise.exercise._id}
                  handleChange={handleChange}
                  handleExerciseComplete={handleExerciseComplete}
                  addSet={addSet}
                />
              )
            )}
          </Flex>
        )}
      </Stack>
    </Container>
  );
}
