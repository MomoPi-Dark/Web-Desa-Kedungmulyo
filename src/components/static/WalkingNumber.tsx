import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

type WalkingNumberProps = {
  start: number;
  end: number;
  duration: number;
};

const WalkingNumber = ({ start, end, duration }: WalkingNumberProps) => {
  const { ref, inView } = useInView({ triggerOnce: true });
  const [currentValue, setCurrentValue] = useState(start || 0);

  useEffect(() => {
    if (inView) {
      const defaultDuration = 10;
      const step = (end - start) / (duration / defaultDuration);
      let value = start;

      const interval = setInterval(() => {
        value += step;
        if ((step > 0 && value >= end) || (step < 0 && value <= end)) {
          setCurrentValue(end);
          clearInterval(interval);
        } else {
          setCurrentValue(Math.round(value));
        }
      }, defaultDuration);

      return () => clearInterval(interval);
    }
  }, [inView, start, end, duration]);

  return { currentValue, ref };
};

export default WalkingNumber;
