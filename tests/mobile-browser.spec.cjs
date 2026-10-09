const {test, expect} = require('@playwright/test');

const base = 'http://127.0.0.1:4173/index.html';
test.use({screenshot: 'only-on-failure', trace: 'retain-on-failure'});

test('Mascot art is visible on Home and the adventure uses the same face',async ({page})=>{
  await page.setViewportSize({width:375,height:812});
  await page.goto(base);
  const hero=page.locator('.mascot-home-art');
  await expect(hero).toBeVisible();
  await expect(page.locator('.mascot-home-greeting')).toContainText('YOUR LEARNING BUDDY');
  await expect(page.locator('.mascot-brand-mark img')).toBeVisible();
  await expect.poll(async()=>hero.evaluate(img=>img.complete&&img.naturalWidth>0)).toBe(true);
  await expect.poll(async()=>page.locator('.mascot-brand-mark img').evaluate(img=>img.complete&&img.naturalWidth>0)).toBe(true);
  await page.locator('.home-play-button').click();
  await page.locator('[data-quest-world="words"]').click();
  await page.locator('[data-quest-answer="información"]').click();
  const face=page.locator('.quest-answer-flash.success .quest-flash-mascot');
  await expect(face).toBeVisible();
  await expect.poll(async()=>face.evaluate(img=>img.complete&&img.naturalWidth>0)).toBe(true);
  await expect(page.locator('.quest-answer-flash.success')).toContainText('Correct!');
});

test('Returning learner sees mascot next to the daily learning path',async ({page})=>{
  await page.goto(base);
  await page.evaluate(()=>{const d=new Date(),today=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');localStorage.setItem('ldna-daily5-v1',JSON.stringify({[today]:{done:['review'],startedAt:Date.now()}}));});
  await page.reload();
  await expect(page.locator('#homeLearningJourney')).toBeVisible();
  await expect(page.locator('.mascot-journey-avatar')).toBeVisible();
  await expect.poll(async()=>page.locator('.mascot-journey-avatar').evaluate(img=>img.complete&&img.naturalWidth>0)).toBe(true);
});

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
  await expect(page.locator('#dailyTutorPanel .daily-focus-card')).toContainText('UNDERSTAND');
  await expect(page.locator('#dailyTutorPanel [data-daily-review-choice]')).toHaveCount(0);
  const choice=page.locator('#dailyTutorPanel [data-daily-help]');
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
  await expect(page.locator('.quest-answer-flash.retry')).toContainText('Here is the right answer: información');
  await expect(page.locator('.quest-prompt')).toHaveText('information');
  await page.locator('[data-quest-answer="información"]').click();
  await expect(page.locator('.quest-answer-flash.success')).toContainText('information → información');
  await page.reload();
  await page.locator('.primary-nav [data-view="game"]').click();
  await expect(page.locator('.quest-prompt')).toHaveText('information');
  await page.locator('[data-quest-next]').click();
  await expect(page.locator('.quest-prompt')).toHaveText('nation');
  const correct=['nación','actividad','celebración','universidad'];
  const nextPrompts=['activity','celebration','university'];
  for(let i=0;i<correct.length;i++){
    await page.locator('[data-quest-answer="'+correct[i]+'"]').click();
    await expect(page.locator('.quest-answer-flash.success')).toBeVisible();
    await page.locator('[data-quest-next]').click();
    if(i<nextPrompts.length)await expect(page.locator('.quest-prompt')).toHaveText(nextPrompts[i]);
    else await expect(page.locator('.quest-victory')).toBeVisible();
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
  await expect(page.locator('.quest-feedback')).toContainText('H is quiet');
  await page.locator('[data-quest-back]').click();
  await expect(page.locator('.quest-world')).toHaveCount(3);
  await expect(page.locator('[data-quest-world="sounds"]')).toContainText('Keep playing');
  await page.locator('[data-quest-world="sounds"]').click();
  await expect(page.locator('.quest-prompt')).toHaveText('hola');
  await page.locator('[data-quest-answer="O"]').click();
  await expect(page.locator('.quest-answer-flash.success')).toBeVisible();
  await page.locator('[data-quest-back]').click();
  await page.locator('[data-quest-world="sentences"]').click();
  await expect(page.locator('.quest-prompt')).toHaveText("I don't understand");
  await page.locator('[data-quest-answer="no entiendo"]').click();
  await expect(page.locator('.quest-answer-flash.success')).toContainText('no entiendo');
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
  await expect(page.locator('.pattern-mini-feedback')).toContainText('The correct answer is vivimos');
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


test('Adventure map teaches first, shows a connected trail, and keeps the mystery locked',async ({page})=>{
  await page.setViewportSize({width:375,height:812});
  await page.goto(base);
  await page.locator('.home-play-button').click();
  await expect(page.locator('#patternQuest .quest-map')).toBeVisible();
  await expect(page.locator('#patternQuest .quest-map-stop')).toHaveCount(3);
  await expect(page.locator('#patternQuest .quest-learn-link')).toHaveCount(3);
  await expect(page.locator('[data-quest-mystery]')).toBeDisabled();
  await expect(page.locator('.quest-map-mystery')).toContainText('0 / 2 worlds completed');
  await page.locator('.quest-map-stop-sounds .quest-learn-link').click();
  await expect(page.locator('#patternDialog')).toHaveAttribute('open','');
  await expect(page.locator('#dialogTitle')).toContainText('silent');
  const width=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  expect(width).toBeLessThanOrEqual(2);
});

test('Sentence Space lets children build, undo and check Spanish with word tiles',async ({page})=>{
  await page.setViewportSize({width:320,height:720});
  await page.goto(base);
  await page.locator('.home-play-button').click();
  await page.locator('[data-quest-world="sentences"]').click();
  await expect(page.locator('[data-quest-build-mode]')).toBeVisible();
  await page.locator('[data-quest-build-mode]').click();
  await expect(page.locator('.quest-built')).toContainText('Tap words');
  await page.locator('[data-quest-tile="0"]').click(); // entiendo
  await expect(page.locator('.quest-built')).toContainText('entiendo');
  await page.locator('[data-quest-undo]').click();
  await expect(page.locator('.quest-built')).toContainText('Tap words');
  await page.locator('[data-quest-tile="0"]').click();
  await page.locator('[data-quest-tile="2"]').click(); // wrong order
  await page.locator('[data-quest-check-tiles]').click();
  await expect(page.locator('.quest-answer-flash.retry')).toContainText('Here is the right answer: no entiendo');
  await page.locator('[data-quest-tile="2"]').click();
  await page.locator('[data-quest-tile="0"]').click();
  await page.locator('[data-quest-check-tiles]').click();
  await expect(page.locator('.quest-answer-flash.success')).toContainText('no entiendo');
  await expect(page.locator('.quest-stars-earned')).toContainText('⭐');
  const width=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  expect(width).toBeLessThanOrEqual(2);
});

test('Sound Safari offers a real listen-first challenge without blocking children who prefer reading',async ({page})=>{
  await page.setViewportSize({width:375,height:812});
  await page.goto(base);
  await page.locator('.home-play-button').click();
  await page.locator('[data-quest-world="sounds"]').click();
  await expect(page.locator('.quest-prompt')).toHaveText('hola');
  await page.locator('[data-quest-listen-mode]').click();
  await expect(page.locator('.quest-prompt')).toHaveText('🔊 Listen, then choose');
  await expect(page.locator('[data-quest-listen]')).toBeVisible();
  await page.locator('[data-quest-listen-mode]').click();
  await expect(page.locator('.quest-prompt')).toHaveText('hola');
  await page.locator('[data-quest-answer="O"]').click();
  await expect(page.locator('.quest-answer-flash.success')).toContainText('first sound');
});

test('Mystery Island unlocks after two mastered worlds and awards an honest replayable badge',async ({page})=>{
  await page.setViewportSize({width:375,height:812});
  await page.goto(base);
  await page.evaluate(()=>localStorage.setItem('ldna-quest-v1',JSON.stringify({best:{words:5,sounds:5,sentences:0},active:null,mysteryWins:0})));
  await page.reload();
  await page.locator('.home-play-button').click();
  await expect(page.locator('.quest-map-mystery')).toContainText('Unlocked!');
  await expect(page.locator('[data-quest-mystery]')).toBeEnabled();
  await page.locator('[data-quest-mystery]').click();
  const correct=['información','O','nación','A','celebración'];
  const following=['hola','nation','hablar','celebration'];
  for(let i=0;i<correct.length;i++){
    await page.locator('[data-quest-answer="'+correct[i]+'"]').click();
    await expect(page.locator('.quest-answer-flash.success')).toBeVisible();
    await page.locator('[data-quest-next]').click();
    if(i<following.length)await expect(page.locator('.quest-prompt')).toHaveText(following[i]);
    else await expect(page.locator('.quest-victory')).toBeVisible();
  }
  await expect(page.locator('.quest-victory')).toContainText('cracked the mystery');
  await expect(page.locator('.quest-earned-badge')).toContainText('Mystery Explorer');
  await expect(page.locator('.quest-earned-badge')).toContainText('New badge unlocked');
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('ldna-quest-v1')));
  expect(saved.mysteryWins).toBe(1);
  expect(saved.best.words).toBe(5);
  await page.locator('[data-quest-back]').click();
  await expect(page.locator('.quest-map-mystery')).toContainText('Mystery Explorer earned');
  await page.reload();
  await page.locator('.primary-nav [data-view="game"]').click();
  await expect(page.locator('.quest-map-mystery')).toContainText('Mystery Explorer earned');
  await expect(page.locator('[data-quest-mystery]')).toBeEnabled();
});


for(const size of [{width:320,height:720},{width:375,height:812},{width:430,height:932}]){
  test('Pattern Quest fits all four answers without scrolling at '+size.width+'px',async ({page})=>{
    await page.setViewportSize(size);
    await page.goto(base);
    await page.locator('.home-play-button').click();
    await page.locator('[data-quest-world="words"]').click();
    await expect(page.locator('[data-view-panel="game"]')).toHaveClass(/quest-focused/);
    await expect(page.locator('.game-intro')).toBeHidden();
    await expect(page.locator('.quest-answer')).toHaveCount(4);
    const info=await page.evaluate(()=>{
      const rect=selector=>document.querySelector(selector).getBoundingClientRect();
      return{
        headerBottom:rect('.topbar').bottom,
        questionTop:rect('.quest-question').top,
        lastAnswerBottom:rect('.quest-answer:last-child').bottom,
        navTop:rect('.primary-nav').top,
        scroll:scrollY,
        overflow:document.documentElement.scrollWidth-innerWidth
      };
    });
    expect(info.lastAnswerBottom,'All four answers above bottom nav').toBeLessThan(info.navTop-4);
    expect(info.questionTop,'Question below header').toBeGreaterThanOrEqual(info.headerBottom-4);
    expect(info.scroll,'A new quest aligns the viewport').toBeLessThanOrEqual(2);
    expect(info.overflow).toBeLessThanOrEqual(2);
  });
}

test('Automatic movement is optional; wrong answers still wait for a retry',async ({page})=>{
  await page.setViewportSize({width:375,height:812});
  await page.goto(base);
  await page.locator('.home-play-button').click();
  await page.locator('[data-quest-world="words"]').click();
  await expect(page.locator('[data-quest-pacing]')).toHaveAttribute('aria-pressed','true');
  await page.locator('[data-quest-pacing]').click();
  await expect(page.locator('[data-quest-pacing]')).toHaveAttribute('aria-pressed','false');
  await page.locator('[data-quest-answer="nación"]').click();
  await expect(page.locator('.quest-answer-flash.retry')).toContainText('Here is the right answer: información');
  await expect(page.locator('.quest-prompt')).toHaveText('information');
  await page.waitForTimeout(1450);
  await expect(page.locator('.quest-prompt')).toHaveText('information');
  await page.locator('[data-quest-answer="información"]').click();
  await expect(page.locator('.quest-answer-flash.success')).toContainText('information → información');
  await expect(page.locator('.quest-prompt')).toHaveText('nation',{timeout:12000});
  await expect(page.locator('.quest-answer-flash.success')).toHaveCount(0);
  const after=await page.evaluate(()=>({
    scroll:scrollY,
    lastAnswerBottom:document.querySelector('.quest-answer:last-child').getBoundingClientRect().bottom,
    navTop:document.querySelector('.primary-nav').getBoundingClientRect().top
  }));
  expect(after.scroll).toBeLessThanOrEqual(2);
  expect(after.lastAnswerBottom).toBeLessThan(after.navTop-4);
});

test('Changing adventure cancels pending auto movement',async ({page})=>{
  await page.setViewportSize({width:375,height:812});
  await page.goto(base);
  await page.locator('.home-play-button').click();
  await page.locator('[data-quest-world="words"]').click();
  await page.locator('[data-quest-answer="información"]').click();
  await expect(page.locator('.quest-answer-flash.success')).toBeVisible();
  await page.locator('[data-quest-back]').click();
  await page.locator('[data-quest-world="sounds"]').click();
  await page.waitForTimeout(1450);
  await expect(page.locator('.quest-prompt')).toHaveText('hola');
  await expect(page.locator('.quest-answer-flash.success')).toHaveCount(0);
});

test('Dark-mode sound choices and sentence tiles fit above mobile nav',async ({page})=>{
  await page.setViewportSize({width:375,height:812});
  await page.goto(base);
  await page.locator('#themeButton').click();
  await page.locator('.home-play-button').click();
  await page.locator('[data-quest-world="sounds"]').click();
  const check=async()=>{
    const rect=await page.evaluate(()=>({
      bottom:document.querySelector('.quest-answer:last-child').getBoundingClientRect().bottom,
      nav:document.querySelector('.primary-nav').getBoundingClientRect().top,
      overflow:document.documentElement.scrollWidth-innerWidth
    }));
    expect(rect.bottom).toBeLessThan(rect.nav-4);
    expect(rect.overflow).toBeLessThanOrEqual(2);
  };
  await check();
  await page.locator('[data-quest-listen-mode]').click();
  await check();
  await page.locator('[data-quest-back]').click();
  await page.locator('[data-quest-world="sentences"]').click();
  await check();
  await page.locator('[data-quest-build-mode]').click();
  await expect(page.locator('.quest-tiles button')).toHaveCount(3);
  const tiles=await page.evaluate(()=>({
    bottom:document.querySelector('.quest-builder-tools').getBoundingClientRect().bottom,
    nav:document.querySelector('.primary-nav').getBoundingClientRect().top
  }));
  expect(tiles.bottom,'Word tiles above nav').toBeLessThan(tiles.nav-4);
});


test('First-visit homepage keeps two obvious paths and additional tools optional',async ({page})=>{
  await page.setViewportSize({width:375,height:812});
  await page.goto(base);
  await expect(page.locator('.home-two-paths button')).toHaveCount(2);
  await expect(page.locator('.home-more-tools')).not.toHaveAttribute('open','');
  await expect(page.locator('.home-more-tools summary')).toBeVisible();
  await page.locator('.home-more-tools summary').click();
  await expect(page.locator('.simple-path-card')).toHaveCount(4);
  await expect(page.locator('.simple-path-grid')).toBeVisible();
  await page.locator('.home-more-tools summary').click();
  await page.locator('.primary-nav [data-view="library"]').click();
  await expect(page.locator('.library-beginner-start')).toContainText('Start here');
  await page.locator('.library-beginner-start [data-open="h-silent"]').click();
  await expect(page.locator('#patternDialog')).toHaveAttribute('open','');
});

test('Opening a pattern no longer awards understanding without learner action',async ({page})=>{
  await page.setViewportSize({width:375,height:812});
  await page.goto(base);
  await page.locator('.home-pattern-card.sounds').click();
  const initial=await page.evaluate(()=>JSON.parse(localStorage.getItem('ldna-pattern-journey-v1')||'{}')['h-silent']||{});
  expect(initial.understand).toBeFalsy();
  expect(initial.examples).toBeFalsy();
  await expect(page.locator('[data-pattern-read="h-silent"]')).toBeVisible();
  await page.locator('[data-pattern-read="h-silent"]').click();
  let record=await page.evaluate(()=>JSON.parse(localStorage.getItem('ldna-pattern-journey-v1')||'{}')['h-silent']||{});
  expect(record.understand).toBeTruthy();
  expect(record.examples).toBeFalsy();
  await page.locator('.pattern-more-examples summary').click();
  await expect(page.locator('.pattern-more-examples')).toHaveAttribute('open','');
  await expect.poll(async()=>page.evaluate(()=>Boolean((JSON.parse(localStorage.getItem('ldna-pattern-journey-v1')||'{}')['h-silent']||{}).examples))).toBe(true);
});

test('Checking the -IR example earns understanding without pre-crediting examples',async ({page})=>{
  await page.setViewportSize({width:375,height:812});
  await page.goto(base);
  await page.locator('.primary-nav [data-view="library"]').click();
  await page.locator('#searchInput').fill('Present -IR verb endings');
  await page.locator('[data-open="regular-ir"]').first().click();
  let initial=await page.evaluate(()=>JSON.parse(localStorage.getItem('ldna-pattern-journey-v1')||'{}')['regular-ir']||{});
  expect(initial.understand).toBeFalsy();
  await page.locator('[data-mini-answer="vivimos"]').click();
  await expect(page.locator('.pattern-mini-feedback.is-correct')).toContainText('You got it');
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('ldna-pattern-journey-v1')||'{}')['regular-ir']||{});
  expect(saved.understand).toBeTruthy();
  expect(saved.examples).toBeFalsy();
});

test('Beginners enter Practice with simple multiple choice instead of typing',async ({page})=>{
  await page.setViewportSize({width:375,height:812});
  await page.goto(base);
  await page.locator('[data-mobile-more]').click();
  await page.locator('#mobileMoreMenu [data-view="practice"]').click();
  await expect(page.locator('[data-mode="choice"]')).toHaveClass(/active/);
  await expect(page.locator('#practiceStage .choice-btn').first()).toBeVisible();
  await expect(page.locator('#writingAnswer')).toHaveCount(0);
});

test('Wrong tick answers teach exactly what to tick and why',async ({page})=>{
  await page.setViewportSize({width:375,height:812});
  await page.goto(base+'?practice=subject-drop');
  await page.locator('[data-mode="tick"]').click();
  const boxes=page.locator('#practiceStage [data-tick]');
  await expect(boxes).toHaveCount(3);
  for(let i=0;i<3;i++)await boxes.nth(i).check();
  await page.locator('#checkTicks').click();
  const explanation=page.locator('#practiceFeedback.feedback-teaching');
  await expect(explanation).toContainText('Tick these:');
  await expect(explanation).toContainText('(Yo) hablo');
  await expect(explanation).toContainText('(Nosotros) comemos');
  await expect(explanation).toContainText('Leave this unticked:');
  await expect(explanation).toContainText('yo habla');
  await expect(explanation).toContainText('with yo, use hablo');
  await expect(page.locator('.tick-explanation')).toHaveCount(3);
  await boxes.nth(1).uncheck();
  await page.locator('#checkTicks').click();
  await expect.poll(async()=>page.evaluate(()=>JSON.parse(localStorage.getItem('ldna-reviews-v1')||'{}')['subject-drop']?.lastQuality)).toBe(2);
  const credited=await page.evaluate(()=>JSON.parse(localStorage.getItem('ldna-skills-v3')||'{}')['subject-drop']?.see||false);
  expect(credited).toBe(false);
});

test('Beginners see everyday descriptions for vowels, accents and going to',async ({page})=>{
  await page.goto(base);
  await page.locator('.primary-nav [data-view="library"]').click();
  await page.locator('#searchInput').fill('accent');
  await page.locator('#patternGrid [data-open="accent-overrides"]').click();
  await expect(page.locator('#dialogTitle')).toContainText('little line');
  await expect(page.locator('.pattern-meaning')).toContainText('stress');
  await expect(page.locator('.worked-example')).toContainText('canción means song');
  await page.locator('#patternDialog .dialog-close').click();
  await page.locator('#searchInput').fill('going to do');
  await page.locator('#patternGrid [data-open="ir-a"]').click();
  await expect(page.locator('.pattern-meaning')).toContainText('Ir is the Spanish word for');
  await expect(page.locator('.worked-example')).toContainText('Voy a comer');
});

test('Practice help teaches with another example instead of revealing this answer',async ({page})=>{
  await page.setViewportSize({width:375,height:812});
  await page.goto(base+'?practice=tion-cion');
  await page.locator('[data-mode="choice"]').click();
  const answer=await page.locator('.choice-btn[data-choice="true"]').innerText();
  await page.locator('#practiceHelpButton').click();
  await expect(page.locator('#practiceHelpPanel')).toBeVisible();
  await expect(page.locator('#practiceHelpPanel')).not.toContainText(answer);
});

test('Manual pacing is the beginner default and preserves the whole explanation',async ({page})=>{
  await page.setViewportSize({width:375,height:812});
  await page.goto(base);
  await page.locator('.home-play-button').click();
  await page.locator('[data-quest-world="words"]').click();
  await expect(page.locator('[data-quest-pacing]')).toHaveAttribute('aria-pressed','true');
  await page.locator('[data-quest-answer="información"]').click();
  await expect(page.locator('.quest-feedback-win')).toBeVisible();
  await expect(page.locator('.quest-feedback-win')).toContainText('-tion ending becomes -ción');
  await page.waitForTimeout(3500);
  await expect(page.locator('.quest-prompt')).toHaveText('information');
  await page.locator('[data-quest-next]').click();
  await expect(page.locator('.quest-prompt')).toHaveText('nation');
  await expect(page.locator('#questQuestionTitle')).toBeFocused();
  await page.reload();
  await page.locator('.primary-nav [data-view="game"]').click();
  await expect(page.locator('[data-quest-pacing]')).toHaveAttribute('aria-pressed','true');
});

test('Shuffled game answers stay stable after reloading the same question',async ({page})=>{
  await page.setViewportSize({width:375,height:812});
  await page.goto(base);
  await page.locator('.home-play-button').click();
  await page.locator('[data-quest-world="words"]').click();
  const before=await page.locator('[data-quest-answer]').evaluateAll(btns=>btns.map(b=>b.dataset.questAnswer));
  expect(new Set(before).size).toBe(4);
  await page.reload();
  await page.locator('.primary-nav [data-view="game"]').click();
  const after=await page.locator('[data-quest-answer]').evaluateAll(btns=>btns.map(b=>b.dataset.questAnswer));
  expect(after).toEqual(before);
  await page.locator('[data-quest-answer="nación"]').click();
  await expect(page.locator('.quest-prompt')).toHaveText('information');
  await expect(page.locator('.quest-answer-flash.retry')).toBeVisible();
});

test('Readable navigation and game choices at 320px in light and dark modes',async ({page})=>{
  await page.setViewportSize({width:320,height:720});
  await page.goto(base);
  const navText=await page.locator('.primary-nav .nav-item').first().evaluate(e=>parseFloat(getComputedStyle(e).fontSize));
  expect(navText).toBeGreaterThanOrEqual(12);
  await page.locator('.home-play-button').click();
  await page.locator('[data-quest-world="words"]').click();
  const font=await page.locator('.quest-answer strong').first().evaluate(e=>parseFloat(getComputedStyle(e).fontSize));
  expect(font).toBeGreaterThanOrEqual(14);
  const measure=async()=>page.evaluate(()=>({
    last:document.querySelector('.quest-answer:last-child').getBoundingClientRect().bottom,
    bottom:document.querySelector('.primary-nav').getBoundingClientRect().top,
    overflow:document.documentElement.scrollWidth-innerWidth
  }));
  for(const theme of ['light','dark']){
    const m=await measure();
    expect(m.last,theme+' answer area').toBeLessThan(m.bottom-4);
    expect(m.overflow,theme+' no page overflow').toBeLessThanOrEqual(2);
    if(theme==='light')await page.locator('#themeButton').click();
  }
});

test('v25 delayed review uses earlier material and records help honestly',async ({page})=>{
  await page.goto(base);
  await page.evaluate(()=>localStorage.setItem('ldna-daily5-v1',JSON.stringify({'2020-01-01':{focusRank:'1',done:['review','link','use','speak','real-life'],completedAt:Date.now()-2*86400000}})));
  await page.reload();await page.locator('#startBeginner').click();
  const panel=page.locator('#dailyTutorPanel');
  await expect(panel.locator('[data-daily-review-choice]').first()).toBeVisible();
  const target=await page.evaluate(()=>Object.values(JSON.parse(localStorage.getItem('ldna-daily5-v1'))).find(r=>r.startedAt).reviewTarget);
  expect(target.day).toBe('2020-01-01');
  await panel.locator('[data-daily-help]').click();
  await expect(panel.locator('.daily-carry')).toContainText(target.answer);
  const earlier=await page.evaluate(()=>JSON.parse(localStorage.getItem('ldna-daily5-v1'))['2020-01-01']);
  expect(earlier.recallIndependent).toBe(false);expect(earlier.recallChecks).toBe(1);
});

test('v25 replay keeps stars and separates assisted completion from independent answers',async ({page})=>{
  await page.goto(base);
  await page.evaluate(()=>{localStorage.setItem('ldna-quest-v1',JSON.stringify({best:{words:5}}));localStorage.setItem('ldna-quest-pacing-v1','manual')});
  await page.reload();await page.locator('.primary-nav [data-view="game"]').click();await page.locator('[data-quest-world="words"]').click();
  await expect(page.locator('.quest-prompt')).toHaveText('education');
  await page.locator('[data-quest-answer="invitación"]').click();
  await expect(page.locator('.quest-answer-flash.retry')).toContainText('Here is the right answer: educación');
  await expect(page.locator('.quest-answer-flash.retry')).toContainText('education → educación');
  await page.reload();await page.locator('.primary-nav [data-view="game"]').click();
  for(const answer of ['educación','invitación','posibilidad','comunicación','curiosidad']){await page.locator('[data-quest-answer="'+answer+'"]').click();await page.locator('[data-quest-next]').click()}
  await expect(page.locator('.quest-evidence')).toContainText('4 / 5');
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('ldna-quest-v1')));expect(saved.best.words).toBe(5);
});
