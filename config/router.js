exports.routers = function() {
  return {
      '/': 'index.front',
      '/add': 'add.addto',
      '/detail/%': 'detail.list'
  }
};
