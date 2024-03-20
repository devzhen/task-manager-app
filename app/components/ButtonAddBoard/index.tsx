import classNames from 'classnames';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { ROUTES } from '@/app/constants';
import usePrevious from '@/app/hooks/usePrevious';

import styles from './ButtonAddBoard.module.css';

export default function ButtonAddBoard() {
  const pathname = usePathname();
  const pathnamePrev = usePrevious(pathname);

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (pathnamePrev && pathnamePrev !== pathname && isLoading) {
      setIsLoading(false);
    }
  }, [isLoading, pathnamePrev, pathname]);

  if (pathname.indexOf(ROUTES.addBoard) !== -1) {
    return null;
  }

  return (
    <button
      className={classNames(styles.container, {
        [styles.containerLoading]: isLoading,
      })}
      onClick={() => {
        setIsLoading(true);
        router.push(ROUTES.addBoard);
      }}
      disabled={isLoading}
    >
      <Image alt="Img" src="/add-board.svg" width={16} height={16} priority />
      <span>
        <FormattedMessage id="board.addNew" />
      </span>
      {isLoading && <div className="animationBlock" />}
    </button>
  );
}
