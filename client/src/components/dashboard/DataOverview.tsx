import { TbWeight } from "react-icons/tb";
import { GiWeightLiftingUp } from "react-icons/gi";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { UserContext } from "../../app";
import { useContext } from "react";
import { useQuery } from "@apollo/client";
import { GET_STAT_SUMMARY } from "../../utils/graphql/queries";
import { Text, Flex, Skeleton } from "@mantine/core";
import { TotalDataDisplay } from "./index";

export default function DataOverView() {
  const {
    data: { _id: userID },
  } = useContext(UserContext);

  const { data, loading, error } = useQuery(GET_STAT_SUMMARY, {
    variables: {
      userID,
    },
  });

  if (loading)
    return (
      <Flex
        justify={{ base: "center", lg: "flex-start" }}
        wrap="wrap"
        gap={{ base: "25px", xs: "60px" }}
      >
        {Array.from({ length: 4 }, (_, index) => (
          <Flex key={index} direction="column" justify="center">
            <Flex align="center" mb={5}>
              <Skeleton h={15} w={15} radius="md" />
              <Skeleton ml={5} height={10} w={35} />
            </Flex>
            <Skeleton height={10} w={75} />
          </Flex>
        ))}
      </Flex>
    );

  if (error)
    return (
      <Text size="xl" fw={500} c="red.6">
        {error.message.toString()}
      </Text>
    );

  const stats = data.getDataSummary.map((summaryData) => ({
    ...summaryData,
    icon: () => {
      switch (summaryData.label) {
        case "total weight lifted":
          return <TbWeight />;
        case "workouts":
          return <IoCheckmarkDoneOutline />;
        default:
          return <GiWeightLiftingUp />;
      }
    },
  }));

  return (
    <Flex
      justify={{ base: "center", lg: "flex-start" }}
      wrap="wrap"
      gap={{ base: "25px", xs: "60px" }}
    >
      {stats.map((theData, i) => (
        <TotalDataDisplay key={i} {...theData} />
      ))}
    </Flex>
  );
}