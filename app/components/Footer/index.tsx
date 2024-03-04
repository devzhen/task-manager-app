import Image from 'next/image';

import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <a href={process.env.GITHUB_REPO}>
        <Image src="/github-mark.png" width={24} height={24} alt="Img" draggable={false} />
        <Image src="/github-logo.png" width={54} height={24} alt="Img" draggable={false} />
        <span>go to the repo</span>
      </a>
    </footer>
  );
}
