import { Container, Modal, Text, useMantineTheme, Flex } from "@mantine/core";
import { useContext, useState } from "react";
import { SAVE_WORKOUT } from "../../utils/graphql/mutations";
import { useMutation } from "@apollo/client";
import WorkoutState from "./WorkoutState";
import { showNotification } from "@mantine/notifications";
import { AiOutlineCheck } from "react-icons/ai";
import { BiErrorCircle } from "react-icons/bi";
import { UserContext } from "../../App";
import { SaveWorkoutBtn, StartWorkoutBtn } from "./index";

export default function TemplateModal({ template, opened, setOpened }) {
  const {
    data: { _id: userID },
  } = useContext(UserContext);

  const [templateState, setTemplateState] = useState(template);

  const theme = useMantineTheme();

  const [saveWorkoutFunction, { loading, error }] = useMutation(SAVE_WORKOUT);

  function handleSaveWorkout() {
    // async await is very inconsistent here
    saveWorkoutFunction({
      variables: {
        templateId: template._id,
        userID: userID,
        exercises: templateState.exercises,
      },
    })
      .then((res) => {
        if (res.data?.saveWorkout.username && !loading) {
          setOpened(false);
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
  }

  return (
    <Modal
      overlayProps={{
        color:
          theme.colorScheme === "dark"
            ? theme.colors.dark[9]
            : theme.colors.gray[2],
        opacity: 0.55,
        blur: 3,
      }}
      transitionProps={{ transition: "rotate-left" }}
      lockScroll={false}
      opened={opened}
      onClose={() => setOpened(false)}
      title={
        <Text
          tt="capitalize"
          variant="gradient"
          gradient={{ from: "#662D8C", to: " #ED1E79", deg: 90 }}
          sx={(theme) => ({
            fontSize: 30,
            fontWeight: "bolder",
            [theme.fn.smallerThan("sm")]: {
              fontSize: 18,
            },
          })}
        >
          {template.templateName}
        </Text>
      }
      overlayopacity={0.55}
      overlayblur={3}
      size="lg"
    >
      <Container>
        <Text c="dimmed">
          {template.templateNotes.trim() ? `- ${template.templateNotes}` : null}
        </Text>

        <WorkoutState
          loading={loading}
          handleSaveWorkout={handleSaveWorkout}
          setTemplateState={setTemplateState}
          templateState={templateState}
        />

        <Flex justify="space-around" align="center">
          <SaveWorkoutBtn
            loading={loading}
            handleSaveWorkout={handleSaveWorkout}
            templateState={templateState}
          />
          <StartWorkoutBtn template={templateState} />
        </Flex>

        {error ? (
          <Text color="red" mt={5}>
            {error.message}
          </Text>
        ) : null}
      </Container>
    </Modal>
  );
}
