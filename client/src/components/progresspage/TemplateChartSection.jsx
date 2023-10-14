import { Box, Title, Flex } from "@mantine/core";
import {
  TemplateSelect,
  TemplateChart,
  DateRangeSelect,
  MetricSelect,
} from "./index";

export default function TemplateChartSection({
  activeTemplate,
  templates,
  setActiveTemplate,
  setRange,
  range,
  userID,
  options,
  classes,
  metric,
  setMetric,
}) {
  return (
    <>
      <Title
        tt="capitalize"
        gradient={{ from: "#662D8C", to: " #ED1E79", deg: 90 }}
        variant="gradient"
        sx={(theme) => ({ color: theme.colors.brand[4] })}
        fw={800}
        component="span"
      >
        {activeTemplate && activeTemplate}
      </Title>

      <Flex
        wrap="wrap"
        gap={5}
        justify={{ base: "center", sm: "left" }}
        mb={30}
      >
        <TemplateSelect
          templates={templates ? templates : []}
          activeTemplate={activeTemplate}
          setActiveTemplate={setActiveTemplate}
        />

        <DateRangeSelect setRange={setRange} />
        <MetricSelect setMetric={setMetric} metric={metric} />
      </Flex>

      <Box className={classes.chartContainer}>
        <TemplateChart
          activeTemplate={activeTemplate}
          userId={userID}
          range={range}
          options={options}
          metric={metric}
        />
      </Box>
    </>
  );
}
