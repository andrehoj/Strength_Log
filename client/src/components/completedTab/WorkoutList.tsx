import { Workout } from "../../types/workout";
import { WorkoutSection } from "../progresspage/index";
import { Text, Accordion } from "@mantine/core";

interface Props {
  activePage: number;
  workouts: Workout[][];
  openAll: boolean;
  isOpen: string[] | null;
  setIsOpen: React.Dispatch<React.SetStateAction<string[] | null>>;
}
export default function WorkoutList({
  workouts,
  activePage,
  openAll,
  isOpen,
  setIsOpen,
}: Props) {
  {
    return (
      <Accordion
        onChange={setIsOpen}
        variant="contained"
        multiple
        value={
          openAll && workouts.length
            ? workouts[activePage - 1].map((workout) =>
                workout.createdAt.toString()
              )
            : isOpen
            ? isOpen
            : []
        }
      >
        {workouts.length ? (
          workouts[activePage - 1].map((workout: Workout) => (
            <Accordion.Item
              key={workout.createdAt.toString()}
              value={workout.createdAt.toString()}
            >
              <Accordion.Control>
                <Text span tt="capitalize" fw={600} size="sm">
                  {new Date(parseInt(workout.createdAt)).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    }
                  )}
                </Text>
              </Accordion.Control>
              <Accordion.Panel>
                <WorkoutSection workout={workout} />
              </Accordion.Panel>
            </Accordion.Item>
          ))
        ) : (
          <Text ta="center" size="xl" fw={500}>
            You have not saved any Workouts yet
          </Text>
        )}
      </Accordion>
    );
  }
}
