const getCounts = () => {
  const followers = JSON.parse(localStorage.iu_followers);
  const followings = JSON.parse(localStorage.iu_followings);

  const diff = followings.filter(item => followers.indexOf(item) === -1);

  return {
    followers: followers.length,
    followings: followings.length,
    diff: diff.length
  };
};

const sleep = ms => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

window.onload = () => {
  if(!localStorage.iu_followers) localStorage.iu_followers = '[]';
  if(!localStorage.iu_followings) localStorage.iu_followings = '[]';

  chrome.runtime.onMessage.addListener(async (data, sender, sendResponse) => {
    if(data.action == 'deleteCache') {
      localStorage.iu_followers = '[]';
      localStorage.iu_followings = '[]';

      sendResponse(getCounts());
    }

    if(data.action == 'getCounts') {
      sendResponse(getCounts());
    }

    if(data.action == 'getFollowers') {
      const links = document.querySelectorAll(
        '[role=dialog] > div > ul > div > li a[title]'
      );

      let followers = JSON.parse(localStorage.iu_followers);

      for(let i = 0, l = links.length; i < l; i++) {
        const username = links[i].title;

        if(!followers.includes(username)) followers.push(username);
      }

      localStorage.iu_followers = JSON.stringify(followers);

      sendResponse(getCounts());
    }

    if(data.action == 'getFollowings') {
      const links = document.querySelectorAll(
        '[role=dialog] > div > ul > div > li a[title]'
      );

      let followings = JSON.parse(localStorage.iu_followings);

      for(let i = 0, l = links.length; i < l; i++) {
        const username = links[i].title;

        if(!followings.includes(username)) followings.push(username);
      }

      localStorage.iu_followings = JSON.stringify(followings);

      sendResponse(getCounts());
    }

    if(data.action == 'unfollow') {
      const followers = JSON.parse(localStorage.iu_followers);
      const followings = JSON.parse(localStorage.iu_followings);

      const diff = followings.filter(item => followers.indexOf(item) === -1);

      for(let i = 0; i < data.count; i++) {
        if(!diff[i]) break;

        const username = diff[i];

        const link = document.querySelector(
          '[role=dialog] > div > ul > div > li a[title="' + username + '"]'
        );
        if(!link) continue;

        const button = link.parentElement.parentElement.parentElement.parentElement.parentElement
          .querySelector('button');
        if(!button) continue;

        button.click();

        await sleep(2000);

        const avatar = document.querySelector(
          '[role=dialog] img[alt="User avatar"]'
        );
        if(!avatar) continue;

        const button2 = avatar.parentElement.parentElement.parentElement.parentElement.parentElement
          .querySelector('button');
        if(!button2) continue;

        button2.click();

        await sleep(10000);
      }

      sendResponse({});
    }
  });
};
