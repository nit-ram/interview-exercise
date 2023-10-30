const puppeteer = require('puppeteer');

async function getCardTitles() {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto('https://trello.com/b/QvHVksDa/personal-work-goals');
  await page.screenshot({ path: 'trello.png' });
  await page.waitForSelector('.oVcaxVSv1L1Ynk');
  await page.click('.oVcaxVSv1L1Ynk');
  await page.screenshot({ path: 'trello2.png' });

  await page.waitForSelector('.RD2CmKQFZKidd6');

  const cardTitles = await page.evaluate(() => {
    const olElement = document.querySelector('ol.RD2CmKQFZKidd6');
    const cardElements = olElement.querySelectorAll('li.T9JQSaXUsHTEzk a[data-testid="card-name"]');
    const titles = [];
    cardElements.forEach((card) => {
      titles.push(card.textContent.trim());
    });
    return titles;
  });

  console.log(cardTitles);

  await browser.close();

  return cardTitles;
}

async function addTasksToTodoist(cardTitles) {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();

  await page.goto('https://app.todoist.com/auth/login?success_page=%2Fapp%2F');

  await page.type('#element-0', 'nitmartmephi@gmail.com');
  await page.type('#element-3', 'Oli@130201914');
  await page.click('button.F9gvIPl');


  await page.waitForNavigation();

  await page.click('#top-menu > li:nth-child(1) > div > div > a > div.X_3UwghUggmfmKrS8M8uwnLl4hgJenHE.GlDqJRGGTu6N54mb4VteNwL9jAu5Mtgq.a83bd4e0._2f303ac3._2a3b75a1._211eebc7');

  for (const title of cardTitles) {
    await page.type('.task_editor__content_field--semibold > div:nth-child(1) > p:nth-child(1)', title);
    await page.click('._7a4dbd5f'); 

  }

  await browser.close();
}

async function main() {
  const cardTitles = await getCardTitles();

  await addTasksToTodoist(cardTitles);
}

main();