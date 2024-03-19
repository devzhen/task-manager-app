const messages = {
  'board.delete.question': `
    Are you sure you want to delete ''{boardName}'' board? {countCards, plural, 
      =0 {} 
      one {There is # card} 
      other {There are # cards}}.
    All data will be removed.`,
  'board.delete': 'Delete Board',
  'board.noCards': 'There are no cards for this board',
  'board.addNew': 'Add new Board',
  'card.addNew': 'Add new Task',
  'card.add': 'Add task',
  cancel: 'Cancel',
  delete: 'Delete',
  description: 'Description',
  title: 'Title',
};

export default messages;
