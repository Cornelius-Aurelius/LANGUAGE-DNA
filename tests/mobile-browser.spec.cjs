const {test, expect} = require('@playwright/test');

const base = 'http://127.0.0.1:4173/index.html';
test.use({screenshot: 'only-on-failure', trace: 'retain-on-failure'});

for (const size of [
  {width:320,height:720},
  {width:375,height:812},
  {width:430,height:932},
  {width:768,height:1024},
  {width:1280,height:800}
]) {
  test('first visit stays usable at ' + size.width + 'px', async ({page}) => {
    await page.setViewportSize(size);
    await page.goto(base);
    await expect(page.locator('#startBeginner')).toBeVisible();
    await expect(page.locator('.simple-home-explore')).toBeVisible();
    await expect(page.locator('.home-pattern-card')).toHaveCount(3);
    await expect(page.locator('.home-how-disclosure')).toBeVisible();
    await expect(page.locator('text=Free from start to finish.')).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, 'No unwanted horizontal page overflow').toBeLessThanOrEqual(2);
    await page.screenshot({path:'test-results/home-' + size.width + '.png',fullPage:true});
  });
}

test('Patterns is one tap away from mobile navigation', async ({page}) => {
  await page.setViewportSize({width:375,height:812});
  await page.goto(base);
  const direct = page.locator('.primary-nav .nav-item[data-view="library"]');
  await expect(direct).toBeVisible();
  await direct.click();
  await expect(page.locator('[data-view-panel="library"]')).toBeVisible();
  await expect(page.locator('#patternGrid .learner-pattern-card').first()).toBeVisible();
  await expect(page.locator('#searchInput')).toBeVisible();
});

test('First-visit pattern cards lead to actual lessons', async ({page}) => {
  await page.setViewportSize({width:375,height:812});
  await page.goto(base);
  await page.locator('.home-pattern-card.sounds').click();
  await expect(page.locator('#patternDialog')).toHaveAttribute('open', '');
  await expect(page.locator('#dialogTitle')).toContainText('H is silent');
  await page.locator('#patternDialog .dialog-close').click();
  await page.locator('.home-pattern-card.words').click();
  await expect(page).toHaveURL(/pattern\.html\?id=tion-cion/);
  await expect(page.locator('#wordSearch')).toBeVisible();
});

test('Mobile More retains Game and Home retains lesson + translator', async ({page}) => {
  await page.setViewportSize({width:375,height:812});
  await page.goto(base);
  await expect(page.locator('#translationForm')).toBeAttached();
  await page.locator('[data-mobile-more]').click();
  await page.locator('#mobileMoreMenu [data-view="game"]').click();
  await expect(page.locator('[data-view-panel="game"]')).toBeVisible();
  await page.locator('.primary-nav [data-view="home"]').click();
  await page.locator('#startBeginner').click();
  await expect(page.locator('[data-view-panel="tutor"]')).toBeVisible();
});

test('Expandable guide and theme toggle keep controls accessible', async ({page}) => {
  await page.setViewportSize({width:375,height:812});
  await page.goto(base);
  await expect(page.locator('.home-how-disclosure')).not.toHaveAttribute('open', '');
  await page.locator('.home-how-disclosure summary').click();
  await expect(page.locator('.home-how-disclosure')).toHaveAttribute('open', '');
  await page.locator('#themeButton').click();
  await expect(page.locator('body')).toHaveClass(/dark/);
  await expect(page.locator('.home-pattern-card.sounds')).toBeVisible();
});


test('Daily 5 renders a real first task without sign-up', async ({page}) => {
  await page.setViewportSize({width:375,height:812});
  await page.goto(base);
  await page.locator('#startBeginner').click();
  await expect(page.locator('#dailyTutorPanel')).toBeVisible();
  await expect(page.locator('#dailyTutorPanel .daily-focus-card')).toBeVisible();
  await expect(page.locator('#dailyTutorPanel [data-daily-review-choice]').first()).toBeVisible();
  const choice=page.locator('#dailyTutorPanel [data-daily-review-choice]').first();
  await choice.click();
  await expect(page.locator('#dailyTutorPanel')).toBeVisible();
});

test('Practice choice mode renders options and accepts an answer', async ({page}) => {
  await page.setViewportSize({width:375,height:812});
  await page.goto(base);
  await page.locator('.primary-nav [data-view="practice"]').click();
  await page.locator('[data-mode="choice"]').click();
  await expect(page.locator('#practiceStage')).toBeVisible();
  await expect(page.locator('#practiceStage .choice-btn').first()).toBeVisible();
  await page.locator('#practiceStage .choice-btn').first().click();
  await expect(page.locator('#practiceStage')).toBeVisible();
});

test('40-question Game starts and records an answer without showing early marking', async ({page}) => {
  await page.setViewportSize({width:375,height:812});
  await page.goto(base);
  await page.locator('[data-mobile-more]').click();
  await page.locator('#mobileMoreMenu [data-view="game"]').click();
  await page.locator('[data-everyday-tab="game"]').click();
  await expect(page.locator('#gameModePanel [data-game-start="1"]').first()).toBeVisible();
  await page.locator('#gameModePanel [data-game-start="1"]').first().click();
  await expect(page.locator('#gameModePanel [data-game-answer]').first()).toBeVisible();
  await page.locator('#gameModePanel [data-game-answer]').first().click();
  await expect(page.locator('#gameModePanel .game-question-card')).toBeVisible();
});

test('Offline app shell still opens after installation', async ({page}) => {
  await page.setViewportSize({width:375,height:812});
  await page.goto(base);
  await page.waitForFunction(() => navigator.serviceWorker && navigator.serviceWorker.controller, {timeout:15000});
  await page.context().setOffline(true);
  await page.reload();
  await expect(page.locator('#startBeginner')).toBeVisible();
  await expect(page.locator('.home-pattern-card.sounds')).toBeVisible();
});


test('Original brand uses distinct friendly colours and tactile primary buttons', async ({page}) => {
  await page.setViewportSize({width:375,height:812});
  await page.goto(base);
  const values = await page.evaluate(() => {
    const selector = s => document.querySelector(s);
    const css = el => getComputedStyle(selector(el));
    return {
      start: css('#startBeginner').backgroundColor,
      explore: css('.simple-home-explore').backgroundColor,
      primaryDepth: css('#startBeginner').boxShadow,
      words: css('.home-pattern-card.words').backgroundImage,
      sounds: css('.home-pattern-card.sounds').backgroundImage,
      sentences: css('.home-pattern-card.sentences').backgroundImage,
      patternVisible: css('.primary-nav [data-view="library"]').display !== 'none'
    };
  });
  expect(values.start).not.toEqual(values.explore);
  expect(values.primaryDepth).not.toEqual('none');
  expect(new Set([values.words,values.sounds,values.sentences]).size).toBe(3);
  expect(values.patternVisible).toBe(true);
});

test('Playful palette remains usable in dark mode at phone width', async ({page}) => {
  await page.setViewportSize({width:320,height:720});
  await page.goto(base);
  await page.locator('#themeButton').click();
  await expect(page.locator('body')).toHaveClass(/dark/);
  await expect(page.locator('#startBeginner')).toBeVisible();
  await expect(page.locator('.simple-home-explore')).toBeVisible();
  await expect(page.locator('.home-pattern-card.sounds')).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  expect(overflow).toBeLessThanOrEqual(2);
});
