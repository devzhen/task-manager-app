import type { FormAttachment, StatusType, TagType } from '@/app/types';

export type AddCardFormInputs = {
  title: string;
  description: string;
  status: StatusType;
  tags: (TagType & { label: string })[];
  attachments: FormAttachment[];
};
