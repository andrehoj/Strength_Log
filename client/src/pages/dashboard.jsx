import classes from "./dashboard.module.css";
import {
  Box,
  Flex,
  Text,
  Divider,
  Title,
  Skeleton,
  Container,
  Group,
  Center,
  Stack,
} from "@mantine/core";
import { Calendar, TemplateSection } from "../components/homepage/index";
import { TbWeight } from "react-icons/tb";
import { GiWeightLiftingUp } from "react-icons/gi";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { UserContext } from "../app";
import { useContext } from "react";
import { gql, useQuery } from "@apollo/client";

const q = gql`
  query ($userID: ID!) {
    getDataSummary(userID: $userID) {
      label
      stat
    }
  }
`;

function DataDisplay({ label, stat, icon, loading }) {
  if (loading) {
    return (
      <Flex direction="column">
        <Flex align="center" mb={5}>
          <Skeleton h={30} w={30} radius="md" />
          <Text span ml={5}>
            <Skeleton height={20} w={70} />
          </Text>
        </Flex>
        <Text fw={400} c="dimmed">
          <Skeleton height={20} w={150} />
        </Text>
      </Flex>
    );
  }
  return (
    <Flex direction="column" justify="center">
      <Flex justify={{ base: "center", lg: "flex-start"} } align="center">
        {icon()}
        <Text ml={5}>{Intl.NumberFormat("en-US").format(stat)}</Text>
      </Flex>
      <Text ta="center" fw={400} c="dimmed" tt="capitalize">
        {label}
      </Text>
    </Flex>
  );
}

export default function DashBoardPage() {
  return (
    <Container fluid>
      <Divider
        variant="dashed"
        labelPosition="left"
        label={<Title c={"white"}>DashBoard</Title>}
        mb={10}
      />
      <Flex
        direction={{ base: "column", lg: "row" }}
        justify={{ base: "center", lg: "space-between" }}
        gap="xl"
        grow
      >
        <Stack style={{ flexGrow: 2, order: 2 }}>
          <DataOverView />
          <TemplateSection />
        </Stack>
        <Box className={classes.calenderContainer}>
          <Center>
            <Calendar />
          </Center>
        </Box>
      </Flex>
    </Container>
  );
}

function DataOverView() {
  const {
    data: { _id: userID },
  } = useContext(UserContext);

  const { data, loading, error } = useQuery(q, {
    variables: {
      userID,
    },
  });

  if (loading)
    return (
      <Flex gap={35}>
        <DataDisplay loading={true} />
      </Flex>
    );

  if (error) return error.message.toString();

  const stats = data.getDataSummary.map((d) => ({
    ...d,
    icon: () => {
      switch (d.label) {
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
      {stats.map((theData) => (
        <DataDisplay {...theData} />
      ))}
    </Flex>
  );
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  const randomNumber = Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  return Intl.NumberFormat("en-US").format(randomNumber);
}