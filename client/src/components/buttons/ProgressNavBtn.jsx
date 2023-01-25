import { SiProgress } from "react-icons/si";
import { Tooltip } from "@material-tailwind/react";

export default function ProgressNavBtn() {
  return (
    <Tooltip
      content="Progress"
      placement="right-start"
      animate={{
        mount: { scale: 1, x: 0 },
        unmount: { scale: 0, x: -35 },
      }}
    >
      <button className={` nav-link`}>
        <SiProgress size={30} />
      </button>
    </Tooltip>
  );
}
