import clsx from "clsx";
import { CSSProperties, FC } from "react";

type ProgressProps = {
  value: number;
  className?: string;
};

const Progress: FC<ProgressProps> = ({ value, className }) => {
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      style={{ "--value": `${value}%` } as CSSProperties}
      className={clsx("radial-progress", className)}
    >
      {value} %
    </div>
  );
};

export default Progress;
