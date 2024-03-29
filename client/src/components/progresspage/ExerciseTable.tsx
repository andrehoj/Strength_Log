import { v4 as uuidv4 } from "uuid";
import { Table } from "@mantine/core";
import { ExerciseShape } from "../../types/template";
interface Props {
  exercise: ExerciseShape;
}
export default function ExerciseTable({ exercise }: Props) {
  const rows = exercise.sets.map((set, i) => (
    <Table.Tr key={uuidv4()}>
      <Table.Td>{i + 1}</Table.Td>
      <Table.Td>{set.reps}</Table.Td>
      <Table.Td>{set.weight}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Table withTableBorder withColumnBorders>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Set</Table.Th>
          <Table.Th>Rep</Table.Th>
          <Table.Th>Weight</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}
