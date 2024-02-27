'use client'
import { getTimeLeft } from "@/External/services";
import { useEffect, useState } from "react";

const Test = () => {
  const [timeLeft, setTimeLeft] = useState('');
  const [deadlines, setDeadlines] = useState([1709424000000, 1719424000000]);
  const [timerList, setTimerList] = useState<string[]>([]);
  const [periodList, setPeriodList] = useState(['Days', 'Hours', 'Mins', 'Secs']);

  useEffect(() => {
    setInterval(() => {
      const updatedTimerList = [...deadlines].map((el) => getTimeLeft(el));
      setTimerList(updatedTimerList);
      setTimeLeft(getTimeLeft(1709424000000));
    }, 1000);

  }, [deadlines])

  return (
    <section>
      {timerList.map((timer, i) => (
        <legend className="timeBox" key={i}>
          {timer.split(',').map((el, ii) => (
            <p key={ii}>
              <span>{el}</span>
              <small>{periodList[i]}</small>
            </p>
          ))}
        </legend>
      ))}
    </section>
  );
}

export default Test;