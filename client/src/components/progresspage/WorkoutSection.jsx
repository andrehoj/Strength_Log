import classes from "./workoutSection.module.css";
import { getTotalVolume } from "../../utils/helpers/functions";
import { Link } from "react-router-dom";
import { ExerciseTable } from "./index";
import { Box, Stack, Text } from "@mantine/core";
import { v4 as uuidv4 } from "uuid";

export default function SingleWorkout({ workout }) {
  return (
    <Box key={uuidv4()}>
      <Text
        className={classes.dateLink}
        component={Link}
        to={`/progress/${workout._id}`}
        state={{ workout: workout }}
      >
        {new Date(parseInt(workout.createdAt)).toLocaleDateString()}
      </Text>
      <Text>
        {workout.template
          ? workout.template.templateName.toString()
          : "Deleted Template"}
      </Text>

      <Stack gap={0}>
        <Text>Total Volume</Text>
        <Text>{getTotalVolume(workout.exercises)}</Text>
      </Stack>

      {workout.exercises.map((exercise) => (
        <Box key={uuidv4()} style={{ maxWidth: "1000px" }}>
          <ExerciseTable exercise={exercise} />
        </Box>
      ))}
    </Box>
  );
}