import { Text, Flex, Button, Drawer } from "@mantine/core";
import { useContext, useState } from "react";
import { SAVE_WORKOUT } from "../../utils/graphql/mutations";
import { useMutation } from "@apollo/client";
import WorkoutState from "./WorkoutState";
import { showNotification } from "@mantine/notifications";
import { AiOutlineCheck } from "react-icons/ai";
import { BiErrorCircle } from "react-icons/bi";
import { UserContext } from "../../contexts/userInfo";
import { StartWorkoutBtn } from "./index";

export default function TemplateDrawer({ template, opened, setOpened }) {
  const {
    data: { _id: userID },
  } = useContext(UserContext);

  const [templateState, setTemplateState] = useState(template);

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
    <Drawer
      opened={opened}
      onClose={() => setOpened(false)}
      title={
        <Text
          tt="capitalize"
          style={{
            fontSize: 25,
            fontWeight: "bolder",
          }}
        >
          {template.templateName}
        </Text>
      }
      size="lg"
    >
      <Text c="dimmed" mb={10}>
        {template.templateNotes.trim() ? `- ${template.templateNotes}` : null}
      </Text>

      <Flex justify="space-around" align="center">
        <Button
          onClick={() => handleSaveWorkout(templateState)}
          loading={loading}
        >
          Quick Save
        </Button>
        <StartWorkoutBtn template={template} />
      </Flex>

      <WorkoutState
        loading={loading}
        handleSaveWorkout={handleSaveWorkout}
        setTemplateState={setTemplateState}
        templateState={templateState}
      />

      {error ? (
        <Text color="red" mt={5}>
          {error.message}
        </Text>
      ) : null}
    </Drawer>
  );
}