'use client';
import { useEffect, useState } from 'react';
import styles from './trackBox.module.css';
import { MdOutlineDeliveryDining, MdOutlineSelfImprovement, MdOutlineWarehouse } from "react-icons/md";
import { getHourGap } from '@/External/time';

type TrackProps = {
  status: string;
  stamp: number
}

const TrackBox = ({ status, stamp }: TrackProps) => {
  const [hours, setHours] = useState(0);
  const [progress, setProgress] = useState('0%');

  useEffect(() => {
    const hoursTemp = getHourGap(stamp);
    if (hoursTemp > 12 && hoursTemp < 20) {
      setProgress('50%');
    } else if (hoursTemp > 20) {
      setProgress('90%');
    }
    setHours(hoursTemp);
  }, [stamp])


  const trackList = [
    { iconEl: <MdOutlineWarehouse />, val: -1 },
    { iconEl: <MdOutlineDeliveryDining />, val: 12 },
    { iconEl: <MdOutlineSelfImprovement />, val: 24 }
  ]

  return (
    <section className={styles.trackBox}>
      {status ?
        <legend className={styles.tracker}>
          <sub className={styles.progress} style={{ width: '100%' }}></sub>
          {trackList.map((icon, i) => (
            <div key={i} className={styles.iconBox}>
              {icon.iconEl}
            </div>
          ))}
        </legend>
        :
        <legend className={styles.tracker}>
          <sub className={styles.progress} style={{ width: progress }}></sub>
          {trackList.map((icon, i) => (
            hours > icon.val ?
              <div key={i} className={styles.iconBox}>
                {icon.iconEl}
              </div>
              :
              <div key={i} className={`${styles.iconBox} ${styles.change}`}>
                {icon.iconEl}
              </div>
          ))}
        </legend>
      }

    </section>
  );
}

export default TrackBox;