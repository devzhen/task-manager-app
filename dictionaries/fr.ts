const messages = {
  'auth.login': '[Fr]: Login',
  'auth.email': '[Fr]: Email',
  'auth.password': '[Fr]: Password',
  'auth.logout': '[Fr]: Logout',
  'auth.logoutConfirm': '[Fr]: Are you sure you want tot logout?',
  'auth.incorrectPassword': '[Fr]: The password is incorrect',
  'auth.incorrectEmail': `[Fr]: The user with the email ''{email}'' was not found`,
  'attachments.message': `[Fr]: Drag 'n' drop some files here, or click to select files`,
  'attachments.restriction':
    '[Fr]: Only PNG and JPG image formats are permitted, and file sizes must not exceed 4.5 MB.',
  'attachments.uploadError': `
    {count, plural, 
      =0 {} 
      one {[Fr]: The file} 
      other {[Fr]: # files}
  } failed to upload due to the format or size restrictions.`,
  'board.delete.question': `
    [Fr]: Are you sure you want to delete the ''{boardName}'' board? {countCards, plural, 
      =0 {} 
      one {It contains # card} 
      other {It contains # cards}
  } All data will be removed.`,
  'board.delete': '[Fr]: Delete Board',
  'board.noCards': '[Fr]: There are no cards for this board',
  'board.addNew': '[Fr]: Create New Board',
  'board.edit': '[Fr]: Edit Board',
  'board.cantDeleteStatus': `[Fr]: Can't delete the ''{statusName}'' status. {countCards, plural,
    =0 {} 
    one {There is # card in this status} 
    other {There are # cards in this status}
  }.`,
  'board.notExist': '[Fr]: This board does not exist.',
  'card.addNew': '[Fr]: Create New Task',
  'card.add': '[Fr]: Add task',
  'card.addNewStatus': '[Fr]: Add a new status',
  'card.addNewTag': '[Fr]: Add a new tag',
  'card.details': '[Fr]: Task Details',
  'card.notExist': '[Fr]: This card does not exist.',
  'card.delete': '[Fr]: Delete Task',
  'card.deleteQuestion': '[Fr]: Are you sure you want to delete this task?',
  'user.addNew': '[Fr]: Add a User',
  'validation.required': '[Fr]: Required',
  'validation.email': '[Fr]: Email is not valid',
  'validation.emailUnique': '[Fr]: The email must be unique',
  admin: '[Fr]: Admin',
  attachments: '[Fr]: Attachments',
  cancel: '[Fr]: Cancel',
  confirmation: 'Fr]: Confirmation',
  chooseColor: '[Fr]: Choose a color',
  color: '[Fr]: Color',
  delete: '[Fr]: Delete',
  description: '[Fr]: Description',
  fontColor: '[Fr]: Font Color',
  loading: '[Fr]: Loading ...',
  member: '[Fr]: Member',
  name: '[Fr]: Name',
  role: '[Fr]: Role',
  settings: '[Fr]: Settings',
  status: '[Fr]: Status',
  statuses: '[Fr]: Statuses',
  submit: '[Fr]: Submit',
  tags: '[Fr]: Tags',
  title: '[Fr]: Title',
  users: '[Fr]: Users',
};

export default messages;
