import fetchUsers from '@/app/api/user/fetchUsers';
import AppIntlProvider from '@/app/components/AppIntlProvider';
import UserList from '@/app/components/UserList';
import { getDictionary } from '@/app/dictionaries';

import styles from './page.module.css';

type UsersPageProps = {
  params: {
    lang: string;
  };
};

export default async function UsersPage(props: UsersPageProps) {
  const { lang } = props.params;

  const [users, dictionary] = await Promise.all([fetchUsers(), getDictionary(lang)]);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <AppIntlProvider dictionary={dictionary} locale={lang}>
          <UserList users={users} />
        </AppIntlProvider>
      </div>
    </div>
  );
}
