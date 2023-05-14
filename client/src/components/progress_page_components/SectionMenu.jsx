import { Tabs } from "@mantine/core";
import { BiStats } from "react-icons/bi";
import { TbBarbell } from "react-icons/tb";

export default function SectionMenu({ setActiveSection }) {
  return (
    <Tabs defaultValue="Summary" onTabChange={setActiveSection}>
      <Tabs.List>
        <Tabs.Tab
          value="Summary"
          icon={<BiStats size={14} />}
          onClick={() => setActiveSection("Summary")}
        >
          Summary
        </Tabs.Tab>
        <Tabs.Tab
          value="Exercises"
          icon={<TbBarbell size={14} />}
          onClick={() => setActiveSection("Exercises")}
        >
          Exercises
        </Tabs.Tab>
      </Tabs.List>
    </Tabs>
  );
}
