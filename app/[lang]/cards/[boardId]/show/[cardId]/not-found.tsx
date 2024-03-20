import AppIntlProvider from '@/app/components/AppIntlProvider';
import NotFoundMessage from '@/app/components/NotFoundMessage';
import getLangAndDictionaryFromHeaders from '@/app/utils/getLangAndDictionaryFromHeaders';

export default async function NotFound() {
  const { locale, dictionary } = await getLangAndDictionaryFromHeaders();

  return (
    <div className="cards-wrapper">
      <AppIntlProvider dictionary={dictionary} locale={locale}>
        <NotFoundMessage message={{ id: 'card.notExist' }} header={{ id: 'card.details' }} />
      </AppIntlProvider>
    </div>
  );
}
