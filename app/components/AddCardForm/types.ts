import type { StatusType, TagLinkerType } from '@/app/types';

export type AddCardFormInputs = {
  title: string;
  description: string;
  status: StatusType;
  tags: (TagLinkerType & { label: string })[];
  attachments: {
    id: string;
    url: string;
    position: number;
    fromDB: boolean;
    file?: File;
  }[];
};
