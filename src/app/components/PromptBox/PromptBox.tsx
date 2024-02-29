import { MdClose, MdOutlineVerified } from 'react-icons/md';
import styles from './promptBox.module.css';
import { FC } from 'react';

type PromptProps = {
  type: string,
  info: string,
  isPlaying: boolean;
}
const PromptBox: FC<PromptProps> = ({ type, info, isPlaying }) => {
  return (
    <legend style={type === 'pass' ? { background: 'var(--pass)' } : { background: 'tomato' }}
      className={isPlaying ? `${styles.promptBox} ${styles.change}` : styles.promptBox}>
      {type === 'pass' ? <MdOutlineVerified /> : <MdClose />} <span>{info}</span>
    </legend>
  );
}

export default PromptBox;