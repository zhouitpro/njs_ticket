exports.routers = function() {
  return {
      '/': 'index.front',
      '/add': 'add.addto',
      '/change_status': 'add.changestatus',
      '/detail/%': 'detail.list'
  }
};
