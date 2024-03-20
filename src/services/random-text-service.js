exports.getRandomText = () => {
  return fetch('https://random-word-api.herokuapp.com/word', {
    method: 'GET',
  }).then((res) => {
    if (res.status >= 300) {
      throw new Error('error');
    }
    return res.text();
  });
};
