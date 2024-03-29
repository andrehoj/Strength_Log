import { useContext } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_TEMPLATE, EDIT_TEMPLATE } from "../utils/graphql/mutations";
import { useNavigate } from "react-router-dom";
import {
  TextInput,
  Text,
  Textarea,
  Container,
  Title,
  Flex,
  Button,
  Box,
  Loader,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { SelectExerciseModal, ExerciseForm } from "../components/create&edittemplates/index";
import { GET_EXERCISES } from "../utils/graphql/queries";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useLocation } from "react-router-dom";
import { UserContext, UserInfo } from "../contexts/userInfo";
import DividerTitle from "../components/universal/DividerTitle";

interface Exercise {
  exerciseName: String;
  _id: String;
  equipment: String;
}

interface Exerciseform {
  value: string;
  label: string;
  _id: string;
  equipment: string;
}

export default function createAndEditTemplate() {
  const userInfo = useContext<UserInfo>(UserContext);
  const userID = userInfo?.data?._id;

  const { state } = useLocation();

  const { data, loading } = useQuery(GET_EXERCISES);

  const [opened, { open, close }] = useDisclosure(false);

  const navigate = useNavigate();

  const form = useForm({
    initialValues: state
      ? { ...state.template }
      : { templateName: "", templateNotes: "", exercises: [] },

    validate: {
      templateName: (value) =>
        value.trim().length ? null : "Please enter a template name",

      exercises: {
        sets: {
          weight: (value) => (value > 1 ? null : "Please enter a valid weight"),
          reps: (value) =>
            value > 1 ? null : "Please enter a valid number of reps",
        },
      },
    },
  });

  const [addTemplate, { loading: submitLoading }] =
    useMutation(CREATE_TEMPLATE);

  const [editTemplate, { loading: editTemplateLoading }] =
    useMutation(EDIT_TEMPLATE);

  if (loading) return <Loader />;

  const exercises = data.getAllExercises.map((e: Exercise) => {
    return {
      value: e.exerciseName,
      label: e.exerciseName,
      _id: e._id,
      equipment: e.equipment,
    };
  });

  async function handleSubmit(event: React.SyntheticEvent) {
    event.preventDefault();

    if (form.validate().hasErrors) return;

    try {
      state
        ? await editTemplate({ variables: { ...form.values } })
        : await addTemplate({ variables: { ...form.values, userId: userID } });

      showNotification({
        title: `${form.values.templateName} is ready`,
        message: "Your template was successfully created",
        autoClose: 3000,
      });

      navigate("/dashboard");
    } catch (error: any) {
      if (error.message) form.setFieldError("templateName", error.message);
    }
  }

  //adds an exercise to the form
  function addExercise(value: string) {
    const e = exercises.find(
      (exercise: Exerciseform) => exercise.value === value
    );

    const exercise = {
      exerciseName: value,
      _id: e._id,
      restTime: 180,
      sets: [{ weight: 135, reps: 8 }],
    };

    const data = { ...form.values };

    data.exercises.push(exercise);

    form.setValues({ ...data });

    close();
  }

  function addSet(exerciseIndex: number) {
    let data = { ...form.values };

    data.exercises[exerciseIndex].sets.push({
      weight:
        data.exercises[exerciseIndex].sets[
          data.exercises[exerciseIndex].sets.length - 1
        ].weight,
      reps: data.exercises[exerciseIndex].sets[
        data.exercises[exerciseIndex].sets.length - 1
      ].reps,
    });

    form.setValues({ ...data });
  }

  function removeSet(index: number, i: number) {
    let data = { ...form.values };

    data.exercises[index].sets = data.exercises[index].sets.filter(
      (_: any, x: number) => i !== x
    );

    form.setValues({ ...data });
  }

  function removeExercise(index: number) {
    let data = { ...form.values };

    const filteredExercises = form.values.exercises.filter(
      (_: any, i: number) => {
        return i !== index;
      }
    );

    data.exercises = filteredExercises;

    form.setValues({ ...data });
  }

  return (
    <Container fluid>
      <DividerTitle
        name={state ? `Edit ${form.values.templateName}` : "Create a template"}
      />
      <Box maw={1200}>
        <form>
          <TextInput
            label={<Text>Template Name</Text>}
            name="templateName"
            mb={15}
            {...form.getInputProps("templateName")}
          />

          <Textarea
            minRows={5}
            name="templateNotes"
            label={<Text>Template Notes</Text>}
            {...form.getInputProps("templateNotes")}
          />
          <Flex mt={10} justify="space-between">
            <Button
              type="submit"
              mb={15}
              loading={submitLoading || editTemplateLoading}
              onClick={handleSubmit}
              disabled={form.values.exercises.length < 1}
            >
              Save Template
            </Button>
          </Flex>

          <Flex direction="column">
            <Flex align="center" wrap="wrap" gap={20}>
              <Title>Exercises</Title>
              <Button onClick={open}>Add Exercise</Button>
            </Flex>
            {form.values.exercises.map(
              (exercise: Exercise, exerciseIndex: number) => (
                <Box maw={475} key={exercise._id as string}>
                  <ExerciseForm
                    exerciseIndex={exerciseIndex}
                    form={form}
                    removeExercise={removeExercise}
                    addSet={addSet}
                    removeSet={removeSet}
                  />
                </Box>
              )
            )}
          </Flex>
        </form>
      </Box>

      <SelectExerciseModal
        opened={opened}
        close={close}
        addExercise={addExercise}
        exercises={exercises}
      />
    </Container>
  );
}
