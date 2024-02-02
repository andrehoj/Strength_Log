import { Text, Flex } from "@mantine/core";

interface Props {
  label: string;
  stat: number;
  icon: () => React.ReactNode;
  statName?: string;
}

export default function TotalDataDisplay(props: Props) {
  const { icon, stat, label, statName } = props;

  return (
    <Flex direction="column" justify="center">
      <Flex justify="center" align="center">
        {icon()}
        <Text ml={5}>{Intl.NumberFormat("en-US").format(stat)}</Text>
      </Flex>
      <Text ta="center" fw={400} tt="capitalize">
        {label} {statName && statName}
      </Text>
    </Flex>
  );
}
