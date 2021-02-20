const send = data => {
  return new Promise(resolve => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, data, response => {
        resolve(response);
      });
    });
  })
};

window.onload = () => {
  send({ action: 'getCounts' }).then(counts => {
    document.querySelector('#countFollowers').textContent = counts.followers;
    document.querySelector('#countFollowings').textContent = counts.followings;
    document.querySelector('#countDiff').textContent = counts.diff;
  });

  document.querySelector('#detectFollowers').onclick = async () => {
    const answer = await send({ action: 'getFollowers' });

    document.querySelector('#countFollowers').textContent = answer.followers;
    document.querySelector('#countFollowings').textContent = answer.followings;
    document.querySelector('#countDiff').textContent = answer.diff;
  };

  document.querySelector('#detectFollowings').onclick = async () => {
    const answer = await send({ action: 'getFollowings' });

    document.querySelector('#countFollowers').textContent = answer.followers;
    document.querySelector('#countFollowings').textContent = answer.followings;
    document.querySelector('#countDiff').textContent = answer.diff;
  };

  document.querySelector('#deleteCache').onclick = async () => {
    const answer = await send({ action: 'deleteCache' });

    document.querySelector('#countFollowers').textContent = answer.followers;
    document.querySelector('#countFollowings').textContent = answer.followings;
    document.querySelector('#countDiff').textContent = answer.diff;
  };

  document.querySelector('#unfollow').onclick = async () => {
    await send({ action: 'unfollow', count: parseInt(document.querySelector('#input').value) });
  };
};