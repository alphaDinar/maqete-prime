'use client';
import Link from 'next/link';
import TopNav from '../components/TopNav/TopNav';
import styles from './notifications.module.css';
import { pageHeader } from '@/External/lists';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { fireAuth, fireStoreDB } from '@/Firebase/base';
import { onAuthStateChanged } from 'firebase/auth';
import Loading from '../components/Loading/Loading';
import Image from 'next/image';
import { MdSchedule } from 'react-icons/md';
import { getTimeSince } from '@/External/time';

interface defType extends Record<string, any> { };
const Notifications = () => {
  const icon = 'https://res.cloudinary.com/dvnemzw0z/image/upload/v1711331864/maqete/Maqete_Icon_r4r1ks.png';
  const [allNotifications, setAllNotifications] = useState<defType[]>([]);
  const [Notifications, setNotifications] = useState<defType[]>([]);
  const [selectedChoice, setSelectedChoice] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authStream = onAuthStateChanged(fireAuth, (user) => {
      if (user) {
        const uid = user.uid;
        const notificationsRef = collection(fireStoreDB, 'Notifications/');
        const notificationStream = onSnapshot(query(notificationsRef, orderBy("timestamp", "desc")), (snapshot) => {
          setAllNotifications(snapshot.docs.map((notification) => ({ id: notification.id, ...notification.data() })));
          setNotifications(snapshot.docs.map((notification) => ({ id: notification.id, ...notification.data() })));
          setIsLoading(false);
        });
        return () => notificationStream();
      }
    });

    return () => authStream();
  }, [])

  const tabList = [
    { tag: 'All' },
    { tag: 'Unread' },
    { tag: 'Read' }
  ]

  const handleChoice = (val: string) => {
    setSelectedChoice(val);
    if (val === 'All') {
      setNotifications(allNotifications);
    } else if (val === 'Active') {
      const updatedNotifications = [...allNotifications].filter((el) => el.status === 0);
      setNotifications(updatedNotifications);
    } else if (val === 'Completed') {
      const updatedNotifications = [...allNotifications].filter((el) => el.status === 1);
      setNotifications(updatedNotifications);
    }
  }

  return (
    <main className="scroll">
      <TopNav />

      <section className={styles.notificationBox} id='boxNoTop'>
        {pageHeader('My Notifications', '/')}

        <article className={styles.tabBox}>
          {tabList.map((el, i) => (
            <legend onClick={() => handleChoice(el.tag)} className={el.tag === selectedChoice ? 'myTab' : 'tab'} key={i}>{el.tag}</legend>
          ))}
        </article>

        {!isLoading ?
          <section className={styles.notifications}>
            {Notifications.map((note, i) => (
              <a className={styles.note} key={i}>
                <Image alt='' src={note.image.url} height={60} width={60} className='contain' />
                <article>
                  <strong>{note.title}</strong>
                  <small>
                    {note.body}
                  </small>
                  <sub className='cash'><MdSchedule /> {getTimeSince(note.timestamp)}</sub>
                </article>
                <legend style={{ background: 'tomato' }}></legend>
              </a>
            ))}

          </section>
          : <Loading />
        }
      </section>
    </main>
  );
}

export default Notifications;