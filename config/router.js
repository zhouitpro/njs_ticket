exports.routers = function() {
  return {
      '/': 'index.front',
      '/add': 'add.addto',
      '/change_status': 'add.changestatus',
      '/upload_file': 'add.uploadfile',
      '/detail/%': 'detail.list'
  }
};
