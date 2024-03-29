'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import type { UserType } from '@/app/types';

import ModalDelete from '../ModalDelete';

import style from './User.module.css';

type UserProps = {
  logout: () => void;
  user: UserType | null;
};

export default function User(props: UserProps) {
  const { logout, user } = props;

  const [isDropdownOpened, setIsDropdownOpened] = useState(false);
  const [isModalOpened, setIsModalOpened] = useState(false);

  const isDropdownOpenedRef = useRef(isDropdownOpened);
  const isModalOpenedRef = useRef(isModalOpened);

  const { formatMessage } = useIntl();

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
        <Image alt="Img" src="/user-icon.svg" width={26} height={26} />
      </button>
      {isDropdownOpened && (
        <div className={style.dropdown}>
          <button>
            <p>
              <FormattedMessage id="settings" />
            </p>
          </button>
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
