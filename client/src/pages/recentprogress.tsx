import { useEffect, useState, useContext } from "react";
import { UserContext } from "../contexts/userInfo";
import {
  Group,
  Select,
  Text,
  Pagination,
  Box,
  Loader,
  Checkbox,
  Center,
} from "@mantine/core";
import { useQuery } from "@apollo/client";
import { GET_PROGRESS_BY_DATE } from "../utils/graphql/queries";
import { Workout } from "../types/workout";
import { chunk } from "../utils/helpers/functions";
import { WorkoutList } from "../components/completedTab";

const limitPerPage = 8;

interface Props {
  activeTemplate: string;
}

export default function RecentProgress({ activeTemplate }: Props) {
  const userInfo = useContext(UserContext);
  const userID = userInfo?.data._id;

  const { data, loading, error } = useQuery(GET_PROGRESS_BY_DATE, {
    variables: { userID: userID },
  });

  const [activePage, setPage] = useState(1);
  const [workouts, setWorkouts] = useState<Workout[][]>();
  const [sortBy, setSortBy] = useState("newest first");
  const [openAll, setOpenAll] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<null | string[]>(null);

  // can't use the data returned from query because filtering pages on client
  useEffect(() => {
    if (data) {
      filterWorkoutsByTemplate(activeTemplate);
    }
  }, [data, activeTemplate]);

  function filterWorkoutsByDate(sortBy: string) {
    let bufferData = workouts?.flat();

    if (bufferData) {
      setWorkouts(
        chunk(
          bufferData.sort((a, b) =>
            sortBy === "oldest first"
              ? parseInt(a.createdAt) - parseInt(b.createdAt)
              : parseInt(b.createdAt) - parseInt(a.createdAt)
          ),
          limitPerPage
        )
      );
    }
    setSortBy(sortBy);
    setPage(1);
  }

  function filterWorkoutsByTemplate(selectName: string) {
    const bufferData = [...data.getProgressByDate];

    if (bufferData) {
      setWorkouts(
        chunk(
          selectName === "all templates"
            ? bufferData.sort((a, b) =>
                sortBy === "oldest first"
                  ? parseInt(a.createdAt) - parseInt(b.createdAt)
                  : parseInt(b.createdAt) - parseInt(a.createdAt)
              )
            : bufferData
                .filter(
                  (workout) => workout.template.templateName === selectName
                )
                .sort((a, b) =>
                  sortBy === "oldest first"
                    ? parseInt(a.createdAt) - parseInt(b.createdAt)
                    : parseInt(b.createdAt) - parseInt(a.createdAt)
                ),
          limitPerPage
        )
      );
    }

    setPage(1);
  }

  if (loading) return <Loader />;

  if (error)
    return (
      <>
        <Text size={"xl"} c="red.5">
          Oops! Something went wrong, Try refreshing the page
        </Text>
        <Text size={"xl"} c="red.5">
          {error.message}
        </Text>
      </>
    );

  if (workouts)
    return (
      <>
        <Group justify="center" mb={10}>
          <Select
            allowDeselect={false}
            value={sortBy}
            data={["newest first", "oldest first"]}
            onChange={(value) => filterWorkoutsByDate(value as string)}
          />

          <Checkbox
            onChange={() => setOpenAll(!openAll)}
            checked={openAll}
            label="Open All"
          />
        </Group>

        <WorkoutList
          openAll={openAll}
          activePage={activePage}
          workouts={workouts}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />

        <Center>
          <Pagination
            my={10}
            total={workouts.length}
            value={activePage}
            onChange={(val) => {
              setPage(val), window.scrollTo(0, 0);
            }}
          />
        </Center>
      </>
    );
}
