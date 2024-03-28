import login from '@/app/api/auth/login';
import LoginForm from '@/app/components/LoginForm';

import styles from './page.module.css';

export default async function LoginPage() {
  return (
    <div className={styles.container}>
      <LoginForm login={login} />
    </div>
  );
}
