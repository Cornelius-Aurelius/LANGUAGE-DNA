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

test('Mobile Play is one tap away, More retains Practice, and Home retains lessons', async ({page}) => {
  await page.setViewportSize({width:375,height:812});
  await page.goto(base);
  await expect(page.locator('#translationForm')).toBeAttached();
  await page.locator('[data-mobile-more]').click();
  await page.locator('#mobileMoreMenu [data-view="practice"]').click();
  await expect(page.locator('[data-view-panel="practice"]')).toBeVisible();
  await page.locator('.primary-nav [data-view="game"]').click();
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
  await page.locator('[data-mobile-more]').click();
  await page.locator('#mobileMoreMenu [data-view="practice"]').click();
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
  await page.locator('.primary-nav [data-view="game"]').click();
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
      start: css('.home-play-button').backgroundColor,
      explore: css('.simple-home-explore').backgroundColor,
      primaryDepth: css('.home-play-button').boxShadow,
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



// v18.1: verify the same visual identity on every learner-facing screen.
test('Every primary screen uses the shared playful card and button system',async ({page})=>{
  await page.setViewportSize({width:375,height:812});
  await page.goto(base);
  const cases=[
    ['course','#courseLevelSummary'],
    ['library','#patternNextCard'],
    ['practice','#practiceStage'],
    ['tutor','#dailyTutorPanel .daily-focus-card'],
    ['game','#everydayLearnPanel .everyday-card'],
    ['dna','#dnaOutcomeHero .dna-outcome-copy']
  ];
  for(const [view,card] of cases){
    await page.locator('.primary-nav [data-view="'+view+'"]').evaluate(button=>button.click());
    await expect(page.locator('[data-view-panel="'+view+'"]')).toBeVisible();
    const target=page.locator(card).first();
    await expect(target).toBeVisible();
    const css=await target.evaluate(el=>{
      const st=getComputedStyle(el);
      return {border:st.borderTopWidth,radius:st.borderTopLeftRadius,shadow:st.boxShadow,background:st.backgroundColor};
    });
    expect(parseFloat(css.border),view+' keeps the branded 2px card outline').toBeGreaterThanOrEqual(2);
    expect(parseFloat(css.radius),view+' keeps round friendly cards').toBeGreaterThanOrEqual(15);
    expect(css.shadow,view+' keeps tactile card depth').not.toBe('none');
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
    const offenders=overflow>2?await page.evaluate(()=>[...document.querySelectorAll('*')].filter(el=>{const r=el.getBoundingClientRect();return r.width>0&&r.right>innerWidth+3}).slice(0,12).map(el=>({tag:el.tagName,className:String(el.className).slice(0,80),id:el.id,width:Math.round(el.getBoundingClientRect().width),right:Math.round(el.getBoundingClientRect().right)}))):[];
    expect(overflow,view+' cannot overflow the mobile screen '+JSON.stringify(offenders)).toBeLessThanOrEqual(2);
  }
});

test('Translation and Pattern dialog inherit the playful brand',async ({page})=>{
  await page.setViewportSize({width:375,height:812});
  await page.goto(base);
  const translator=page.locator('#quickTranslator .translator-panel');
  await expect(translator).toBeVisible();
  const translatorBorder=await translator.evaluate(el=>getComputedStyle(el).borderTopWidth);
  expect(parseFloat(translatorBorder)).toBeGreaterThanOrEqual(2);
  await page.locator('.home-pattern-card.sounds').click();
  await expect(page.locator('#patternDialog')).toHaveAttribute('open','');
  const dialog=page.locator('#patternDialog');
  const dialogRadius=await dialog.evaluate(el=>getComputedStyle(el).borderTopLeftRadius);
  expect(parseFloat(dialogRadius)).toBeGreaterThanOrEqual(20);
});

test('All seven screens stay branded and readable in dark mode',async ({page})=>{
  await page.setViewportSize({width:430,height:932});
  await page.goto(base);
  await page.locator('#themeButton').click();
  await expect(page.locator('body')).toHaveClass(/dark/);
  for(const view of ['home','course','library','practice','tutor','game','dna']){
    await page.locator('.primary-nav [data-view="'+view+'"]').evaluate(button=>button.click());
    await expect(page.locator('[data-view-panel="'+view+'"]')).toBeVisible();
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
    const offenders=overflow>2?await page.evaluate(()=>[...document.querySelectorAll('*')].filter(el=>{const r=el.getBoundingClientRect();return r.width>0&&r.right>innerWidth+3}).slice(0,12).map(el=>({tag:el.tagName,className:String(el.className).slice(0,80),id:el.id,width:Math.round(el.getBoundingClientRect().width),right:Math.round(el.getBoundingClientRect().right)}))):[];
    expect(overflow,view+' dark view should fit mobile '+JSON.stringify(offenders)).toBeLessThanOrEqual(2);
  }
});

test('Complete pattern dictionary has the branded surfaces on mobile',async ({page})=>{
  await page.setViewportSize({width:375,height:812});
  await page.goto('http://127.0.0.1:4173/pattern.html?id=tion-cion');
  await expect(page.locator('.pattern-heading')).toBeVisible();
  await expect(page.locator('.pattern-teaching')).toBeVisible();
  await expect(page.locator('.dictionary-table-wrap')).toBeVisible();
  const palette=await page.evaluate(()=>{
    const h=getComputedStyle(document.querySelector('.pattern-heading'));
    const b=getComputedStyle(document.querySelector('.dictionary-table-wrap'));
    return {headerRadius:h.borderRadius,tableBorder:b.borderTopWidth}
  });
  expect(parseFloat(palette.headerRadius)).toBeGreaterThan(18);
  expect(parseFloat(palette.tableBorder)).toBeGreaterThanOrEqual(2);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  expect(overflow).toBeLessThanOrEqual(2);
});


test('First Daily 5 is help-friendly and stays on the same word throughout',async ({page})=>{
  await page.setViewportSize({width:375,height:812});
  await page.goto(base);
  await expect(page.locator('#homeLearningJourney')).toBeHidden();
  await page.locator('#startBeginner').click();
  const panel=page.locator('#dailyTutorPanel');
  await expect(panel.locator('.daily-journey-steps li')).toHaveCount(5);
  await expect(panel.locator('[data-daily-help]')).toBeVisible();
  await panel.locator('[data-daily-help]').click();
  await expect(panel.locator('.daily-link-pair')).toBeVisible();
  const firstEnglish=(await panel.locator('.daily-link-pair strong').first().textContent()).trim();
  const firstSpanish=(await panel.locator('.daily-link-pair strong').last().textContent()).trim();
  const record=await page.evaluate(()=>{
    const d=Object.values(JSON.parse(localStorage.getItem('ldna-daily5-v1')||'{}'))[0];
    return {focusRank:d.focusRank,scenarioId:d.scenarioId,done:d.done};
  });
  expect(record.focusRank).toBeTruthy();
  expect(record.scenarioId).toBeTruthy();
  expect(record.done).toContain('review');
  await expect(panel.locator('[data-tutor-speak-slow]')).toBeVisible();
  await panel.locator('[data-daily-link-done]').click();
  await expect(panel.locator('.daily-focus-card h2')).toHaveText(firstEnglish);
  // The focus word must not change even after being marked familiar at the link step.
  await page.reload();
  await page.locator('.primary-nav [data-view="tutor"]').click();
  await expect(panel.locator('.daily-focus-card h2')).toHaveText(firstEnglish);
  await panel.locator('[data-daily-use-choice]').filter({hasText:firstSpanish}).first().click();
  await expect(panel.locator('[data-daily-speak]')).toBeVisible();
  await panel.locator('[data-daily-self-speak]').click();
  await expect(panel.locator('[data-daily-scenario-choice]').first()).toBeVisible();
  // Try available replies; a wrong first choice is safe to retry.
  const options=await panel.locator('[data-daily-scenario-choice]').allTextContents();
  for(const answer of options){
    if(await panel.locator('.daily-celebration').count())break;
    await panel.locator('[data-daily-scenario-choice]').filter({hasText:answer}).first().click();
  }
  await expect(panel.locator('.daily-celebration')).toBeVisible();
  await expect(panel.locator('.daily-won-word')).toContainText(firstSpanish);
  await expect(panel.locator('[data-view="library"]')).toBeVisible();
  await panel.locator('[data-view="dna"]').click();
  await expect(page.locator('#journeyMilestones .journey-milestone.earned')).toHaveCount(1);
  await expect(page.locator('#journeyWinsStatus')).toContainText('1 learning day');
});

test('Learning milestones reward non-consecutive days without streak penalties',async ({page})=>{
  await page.setViewportSize({width:320,height:720});
  await page.goto(base);
  await page.evaluate(()=>{
    localStorage.setItem('ldna-daily5-v1',JSON.stringify({
      '2026-01-01':{done:['review','link','use','speak','real-life'],completedAt:1},
      '2026-03-05':{done:['review','link','use','speak','real-life'],completedAt:2},
      '2026-09-20':{done:['review','link','use','speak','real-life'],completedAt:3}
    }));
  });
  await page.reload();
  await expect(page.locator('#homeLearningJourney')).toBeVisible();
  await page.locator('.primary-nav [data-mobile-more]').click();
  await page.locator('#mobileMoreMenu [data-view="dna"]').click();
  await expect(page.locator('#journeyMilestones .journey-milestone.earned')).toHaveCount(2);
  await expect(page.locator('#journeyWinsStatus')).toContainText('3 learning days');
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  expect(overflow).toBeLessThanOrEqual(2);
});



test('Home offers two obvious choices and Play is directly in mobile navigation',async ({page})=>{
  await page.setViewportSize({width:320,height:720});
  await page.goto(base);
  await expect(page.locator('.home-two-paths button')).toHaveCount(2);
  await expect(page.locator('.simple-home-explore')).toBeVisible();
  await expect(page.locator('.home-play-button')).toBeVisible();
  await expect(page.locator('.primary-nav [data-view="library"]')).toBeVisible();
  await expect(page.locator('.primary-nav [data-view="game"]')).toBeVisible();
  const width=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  expect(width).toBeLessThanOrEqual(2);
  await page.locator('.home-play-button').click();
  await expect(page.locator('[data-view-panel="game"]')).toBeVisible();
  await expect(page.locator('#patternQuest .quest-world')).toHaveCount(3);
});

test('Word Garden teaches a real English-Spanish pattern and rewards completion',async ({page})=>{
  await page.setViewportSize({width:375,height:812});
  await page.goto(base);
  await page.locator('[data-quest-open]').first().click();
  await page.locator('[data-quest-world="words"]').click();
  await expect(page.locator('.quest-prompt')).toHaveText('information');
  // Wrong answers teach a clue and do not remove a life or advance unfairly.
  await page.locator('[data-quest-answer="nación"]').click();
  await expect(page.locator('.quest-feedback')).toContainText('Nice try');
  await expect(page.locator('.quest-prompt')).toHaveText('information');
  await page.locator('[data-quest-answer="información"]').click();
  await expect(page.locator('.quest-feedback-win')).toContainText('Star earned');
  await page.reload();
  await page.locator('.primary-nav [data-view="game"]').click();
  await expect(page.locator('.quest-feedback-win')).toBeVisible();
  await page.locator('[data-quest-next]').click();
  const correct=['nación','actividad','celebración','universidad'];
  for(const answer of correct){
    await page.locator('[data-quest-answer="'+answer+'"]').click();
    await expect(page.locator('.quest-feedback-win')).toBeVisible();
    await page.locator('[data-quest-next]').click();
  }
  await expect(page.locator('.quest-victory')).toBeVisible();
  await expect(page.locator('.quest-victory-stars')).toContainText('⭐⭐⭐⭐⭐');
  await expect(page.locator('.quest-earned-badge')).toContainText('Word Detective');
  await expect(page.locator('.quest-earned-badge')).toContainText('New badge unlocked!');
  await page.locator('[data-quest-back]').click();
  await expect(page.locator('.quest-world')).toHaveCount(3);
  await page.locator('.primary-nav [data-view="dna"]').evaluate(button=>button.click());
  await expect(page.locator('#questProgressSummary')).toContainText('5 of 15 adventure stars');
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('ldna-quest-v1')));
  expect(saved.best.words).toBe(5);
});

test('Child-friendly game offers free hints, a back action and sound/sentence worlds',async ({page})=>{
  await page.setViewportSize({width:375,height:812});
  await page.goto(base);
  await page.locator('.home-play-button').click();
  await page.locator('[data-quest-world="sounds"]').click();
  await expect(page.locator('.quest-question h3')).toContainText('sound');
  await expect(page.locator('[data-quest-listen]')).toBeVisible();
  await page.locator('[data-quest-clue]').click();
  await expect(page.locator('.quest-feedback')).toContainText('H is silent');
  await page.locator('[data-quest-back]').click();
  await expect(page.locator('.quest-world')).toHaveCount(3);
  await expect(page.locator('[data-quest-world="sounds"]')).toContainText('Keep playing');
  await page.locator('[data-quest-world="sounds"]').click();
  await expect(page.locator('.quest-prompt')).toHaveText('hola');
  await page.locator('[data-quest-answer="O"]').click();
  await expect(page.locator('.quest-feedback-win')).toBeVisible();
  await page.locator('[data-quest-back]').click();
  await page.locator('[data-quest-world="sentences"]').click();
  await expect(page.locator('.quest-prompt')).toHaveText("I don't understand");
  await page.locator('[data-quest-answer="no entiendo"]').click();
  await expect(page.locator('.quest-feedback-win')).toContainText('no entiendo');
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('ldna-quest-v1')));
  expect(saved.best.words||0).toBe(0);
});

test('All quests and earned stars work offline and in dark mode',async ({page})=>{
  await page.setViewportSize({width:320,height:720});
  await page.goto(base);
  await page.waitForFunction(()=>navigator.serviceWorker&&navigator.serviceWorker.controller,{timeout:15000});
  await page.context().setOffline(true);
  await page.reload();
  await page.locator('#themeButton').click();
  await page.locator('.home-play-button').click();
  await expect(page.locator('#patternQuest .quest-world')).toHaveCount(3);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  expect(overflow).toBeLessThanOrEqual(2);
});



test('Difficult -IR pattern is explained as three friendly actions before optional detailed progress',async ({page})=>{
  await page.setViewportSize({width:375,height:812});
  await page.goto(base);
  await page.locator('.primary-nav [data-view="library"]').click();
  await page.locator('#searchInput').fill('Present -IR verb endings');
  await page.locator('[data-open="regular-ir"]').first().click();
  await expect(page.locator('#patternDialog')).toHaveAttribute('open','');
  await expect(page.locator('#dialogTitle')).toContainText('Change -ir');
  await expect(page.locator('.pattern-teaching-steps li')).toHaveCount(3);
  await expect(page.locator('.pattern-teaching-steps')).toContainText('vivir');
  await expect(page.locator('.pattern-teaching-steps')).toContainText('vivimos');
  await expect(page.locator('.pattern-journey-details')).not.toHaveAttribute('open','');
  await expect(page.locator('.pattern-mini-check')).toContainText('we live');
  await page.locator('[data-mini-answer="viven"]').click();
  await expect(page.locator('.pattern-mini-feedback')).toContainText('Good try');
  await page.locator('[data-mini-answer="vivimos"]').click();
  await expect(page.locator('.pattern-mini-feedback')).toContainText('You got it');
  await page.locator('.pattern-journey-details summary').click();
  await expect(page.locator('.pattern-journey-details')).toHaveAttribute('open','');
  await expect(page.locator('.pattern-journey-steps')).toBeAttached();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  expect(overflow).toBeLessThanOrEqual(2);
  await page.locator('.pattern-easy-actions [data-practice="regular-ir"]').click();
  await expect(page.locator('[data-view-panel="practice"]')).toBeVisible();
});

test('Difficult -AR pattern teaches a real transformation and one-question practice',async ({page})=>{
  await page.setViewportSize({width:320,height:720});
  await page.goto(base);
  await page.locator('.primary-nav [data-view="library"]').click();
  await page.locator('#searchInput').fill('Present -AR verb endings');
  await page.locator('[data-open="regular-ar"]').first().click();
  await expect(page.locator('#dialogTitle')).toContainText('Change the ending');
  await expect(page.locator('.pattern-teaching-steps')).toContainText('hablamos');
  await expect(page.locator('.pattern-mini-check')).toContainText('we speak');
  await page.locator('[data-mini-answer="hablamos"]').click();
  await expect(page.locator('.pattern-mini-feedback.is-correct')).toContainText('habl- + -amos');
  await expect(page.locator('.pattern-why-details')).not.toHaveAttribute('open','');
  await page.locator('.pattern-why-details summary').click();
  await expect(page.locator('.pattern-why-details')).toHaveAttribute('open','');
});
