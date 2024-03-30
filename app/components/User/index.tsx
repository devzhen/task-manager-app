'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { isEmpty } from 'ramda';
import { useEffect, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { ROUTES } from '@/app/constants';
import type { UserType } from '@/app/types';

import ModalDelete from '../ModalDelete';

import style from './User.module.css';

type UserProps = {
  logout: () => void;
  user: UserType | null;
  users: UserType[];
};

export default function User(props: UserProps) {
  const { logout, user, users } = props;

  const [isDropdownOpened, setIsDropdownOpened] = useState(false);
  const [isModalOpened, setIsModalOpened] = useState(false);

  const isDropdownOpenedRef = useRef(isDropdownOpened);
  const isModalOpenedRef = useRef(isModalOpened);

  const { formatMessage } = useIntl();

  const router = useRouter();

  const logoutHandler = () => {
    setIsModalOpened(false);
    setIsDropdownOpened(false);
    logout();
  };

  useEffect(() => {
    isDropdownOpenedRef.current = isDropdownOpened;
    isModalOpenedRef.current = isModalOpened;
  }, [isDropdownOpened, isModalOpened]);

  useEffect(() => {
    const outsideClickListener = (event: MouseEvent) => {
      const target = event.target as HTMLDivElement;

      if (
        target?.closest(`.${style.container}`) === null &&
        isDropdownOpenedRef.current &&
        !isModalOpenedRef.current
      ) {
        setIsDropdownOpened(false);
      }
    };

    document.addEventListener('click', outsideClickListener);

    return () => {
      document.removeEventListener('click', outsideClickListener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!user) {
    return <div />;
  }

  return (
    <div className={style.container}>
      <button onClick={() => setIsDropdownOpened((prev) => !prev)}>
        <Image alt="Img" src="/user-icon.svg" width={22} height={22} />
      </button>
      {isDropdownOpened && (
        <div className={style.dropdown}>
          <button>
            <p>
              <FormattedMessage id="settings" />
            </p>
          </button>
          {!isEmpty(users) && (
            <button
              onClick={() => {
                router.push(ROUTES.users);
                setIsDropdownOpened(false);
              }}
            >
              <p>
                <FormattedMessage id="users" />
              </p>
            </button>
          )}
          <button onClick={() => setIsModalOpened(true)}>
            <p>
              <FormattedMessage id="auth.logout" />
            </p>
          </button>
        </div>
      )}
      {isModalOpened && (
        <ModalDelete
          closeModal={() => setIsModalOpened(false)}
          title={formatMessage({ id: 'confirmation' })}
          description={formatMessage({ id: 'auth.logoutConfirm' })}
          deleteBtnText="auth.logout"
          onDelete={logoutHandler}
        />
      )}
    </div>
  );
}
