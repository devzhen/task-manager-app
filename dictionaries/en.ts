const messages = {
  'attachments.message': `Drag 'n' drop some files here, or click to select files`,
  'attachments.restriction':
    'Only PNG and JPG image formats are permitted, and file sizes must not exceed 4.5 MB.',
  'attachments.uploadError': `
    {count, plural, 
      =0 {} 
      one {The file} 
      other {# files}
  } failed to upload due to the format or size restrictions.`,
  'board.delete.question': `
    Are you sure you want to delete the ''{boardName}'' board? {countCards, plural, 
      =0 {} 
      one {It contains # card} 
      other {It contains # cards}
  } All data will be removed.`,
  'board.delete': 'Delete Board',
  'board.noCards': 'There are no cards for this board',
  'board.addNew': 'Create New Board',
  'board.edit': 'Edit Board',
  'board.cantDeleteStatus': `Can't delete the ''{statusName}'' status. {countCards, plural,
    =0 {} 
    one {There is # card in this status} 
    other {There are # cards in this status}
  }.`,
  'board.notExist': 'This board does not exist.',
  'card.addNew': 'Create New Task',
  'card.add': 'Add task',
  'card.addNewStatus': 'Add a new status',
  'card.addNewTag': 'Add a new tag',
  'card.details': 'Task Details',
  'card.notExist': 'This card does not exist.',
  'card.delete': 'Delete Task',
  'card.deleteQuestion': 'Are you sure you want to delete this task?',
  attachments: 'Attachments',
  cancel: 'Cancel',
  chooseColor: 'Choose a color',
  color: 'Color',
  delete: 'Delete',
  description: 'Description',
  fontColor: 'Font Color',
  loading: 'Loading ...',
  name: 'Name',
  status: 'Status',
  statuses: 'Statuses',
  submit: 'Submit',
  tags: 'Tags',
  title: 'Title',
};

export default messages;
