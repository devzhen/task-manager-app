import CardsWrapper from '@/app/components/CardsWrapper';
import StatusesLoading from '@/app/components/Statuses/loading';

export default async function Loading() {
  return (
    <CardsWrapper>
      <StatusesLoading />
    </CardsWrapper>
  );
}
