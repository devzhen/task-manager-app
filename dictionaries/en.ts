const messages = {
  'board.delete.question': `
    Are you sure you want to delete the ''{boardName}'' board? {countCards, plural, 
      =0 {} 
      one {It contains # card} 
      other {It contains # cards}
  }. All data will be removed.`,
  'board.delete': 'Delete Board',
  'board.noCards': 'There are no cards for this board',
  'board.addNew': 'Add new Board',
  'board.edit': 'Edit Board',
  'board.cantDeleteStatus': `Can't delete the ''{statusName}'' status. {countCards, plural,
    =0 {} 
    one {There is # card in this status} 
    other {There are # cards in this status}
  }.`,
  'board.notExist': 'This board does not exist.',
  'card.addNew': 'Add new Task',
  'card.add': 'Add task',
  'card.addNewStatus': 'Add a new status',
  'card.addNewTag': 'Add a new tag',
  chooseColor: 'Choose a color',
  cancel: 'Cancel',
  delete: 'Delete',
  description: 'Description',
  title: 'Title',
  status: 'Status',
  statuses: 'Statuses',
  submit: 'Submit',
  tags: 'Tags',
  name: 'Name',
  color: 'Color',
  fontColor: 'Font Color',
};

export default messages;
