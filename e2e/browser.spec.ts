import { expect, test, type Page } from '@playwright/test';

const api = 'https://udupi-darshan-be.onrender.com';
const encode = (value: object) =>
  Buffer.from(JSON.stringify(value)).toString('base64url');
const token = [
  encode({ alg: 'HS256' }),
  encode({
    sub: 'fixture-admin',
    iss: 'udupi-darshan',
    aud: 'udupi-darshan-api',
    exp: Math.floor(Date.now() / 1000) + 3600,
  }),
  'fixture-signature',
].join('.');

async function mockApi(page: Page, allowAdmin = true) {
  const calls: string[] = [];
  await page.route(api + '/**', async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    const method = request.method();
    const headers = {
      'access-control-allow-origin': '*',
      'access-control-allow-headers': 'authorization, content-type',
      'access-control-allow-methods': 'GET, POST, DELETE, OPTIONS',
    };
    if (method === 'OPTIONS') return route.fulfill({ status: 204, headers });
    calls.push(method + ' ' + path);
    if (method === 'POST' && path === '/v1/admin/sign-in') {
      expect(request.postDataJSON()).toEqual({
        userName: 'fixture-admin',
        password: 'fixture-password',
      });
      return route.fulfill({ headers, body: token });
    }
    if (path === '/actuator/info' || path === '/v1/jwt/revoke') {
      expect(request.headers()['authorization']).toBe('Bearer ' + token);
      return route.fulfill({
        headers,
        status: path === '/actuator/info' && !allowAdmin ? 403 : 200,
        body: '{}',
      });
    }
    if (method === 'GET') {
      expect(request.headers()['authorization']).toBeUndefined();
      return route.fulfill({ headers, json: [] });
    }
    return route.fulfill({ headers, status: 500 });
  });
  return calls;
}

async function signIn(page: Page) {
  await page.getByLabel('Username').fill('fixture-admin');
  await page.getByLabel('Password', { exact: true }).fill('fixture-password');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
}

test('mobile visitors can navigate to public content and unknown routes land on 404', async ({
  page,
}) => {
  await mockApi(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#/home');
  await expect
    .poll(() =>
      page
        .locator('img[srcset*="a6-480"]')
        .evaluate((img: HTMLImageElement) => img.currentSrc),
    )
    .toContain('/assets/images/a6-480.jpg');
  const museum = page.getByRole('img', { name: "Udupi's cultural heritage" });
  await museum.scrollIntoViewIfNeeded();
  await expect
    .poll(() => museum.evaluate((img: HTMLImageElement) => img.naturalWidth))
    .toBeGreaterThan(0);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.getByRole('button', { name: 'Open navigation' }).click();
  const menu = page.getByRole('dialog', { name: 'Explore Udupi' });
  await menu.getByRole('link', { name: 'Nature', exact: true }).click();
  await expect(page).toHaveURL(/#\/nature$/);
  await expect(page).toHaveTitle(/Nature in Udupi/);
  await expect(menu).toBeHidden();
  await page.goto('/#/missing-route');
  await expect(page).toHaveURL(/#\/404$/);
});

test('admin guard, password sign-in and sign-out work in a browser', async ({
  page,
}) => {
  const calls = await mockApi(page);
  await page.goto('/#/admindashboard');
  await expect(page).toHaveURL(/#\/admin(?:\?access=required)?$/);
  await signIn(page);
  await expect(page).toHaveURL(/#\/admindashboard$/);
  await expect(
    page.getByRole('heading', { name: 'Admin dashboard' }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: /Add Nature/ })).toHaveAttribute(
    'href',
    '#/new-entry/nature',
  );
  await page.setViewportSize({ width: 360, height: 800 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    360,
  );
  const revoked = page.waitForResponse(
    (response) => response.url() === api + '/v1/jwt/revoke',
  );
  await page.getByRole('button', { name: 'Sign out' }).click();
  expect((await revoked).ok()).toBe(true);
  await page.goto('/#/new-entry');
  await expect(page).toHaveURL(/#\/admin(?:\?access=required)?$/);
  expect(calls).toContain('GET /actuator/info');
  expect(calls).toContain('DELETE /v1/jwt/revoke');
});

test('a server role denial prevents access even after receiving a token', async ({
  page,
}) => {
  await mockApi(page, false);
  await page.goto('/#/admin');
  await signIn(page);
  await expect(page.getByRole('alert')).toContainText(
    'does not have administrator access',
  );
  await page.goto('/#/admindashboard');
  await expect(page).toHaveURL(/#\/admin(?:\?access=required)?$/);
});

test('mobile admin sign-in guides the user with a single form', async ({
  page,
}) => {
  await mockApi(page);
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/#/admin');
  await expect(
    page.getByRole('heading', { name: 'Admin sign in' }),
  ).toBeVisible();
  await expect(page.getByRole('navigation')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    360,
  );

  await page.getByLabel('Username').fill('fixture-admin');
  const password = page.getByLabel('Password', { exact: true });
  await password.fill('fixture-password');
  await page.getByRole('button', { name: 'Show password' }).click();
  await expect(password).toHaveAttribute('type', 'text');
  await page.getByRole('button', { name: 'Hide password' }).click();
  await expect(password).toHaveAttribute('type', 'password');
  await expect(
    page.getByRole('button', { name: 'Sign in', exact: true }),
  ).toBeEnabled();
  await page.getByRole('link', { name: 'Back to public site' }).click();
  await expect(page).toHaveURL(/#\/home$/);
  await expect(page.getByRole('navigation').first()).toBeVisible();
});

function multipartRecord(request:import('@playwright/test').Request){
 const body=request.postDataBuffer()!.toString('utf8');
 return {data:JSON.parse(body.match(/name="data"\r\n\r\n([\s\S]*?)\r\n--/)![1]),key:body.match(/name="requestKey"\r\n\r\n([^\r]+)/)![1],body};
}
const adminPng=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==','base64');
const photoFile=(name='photo.png')=>({name,mimeType:'image/png',buffer:adminPng});
test('admin publishes each content type using uploaded images instead of URLs',async({page})=>{
 await mockApi(page);const requests:{kind:string;data:any}[]=[];
 await page.route(api+'/v1/admin/content/*',route=>{
  expect(route.request().method()).toBe('POST');expect(route.request().headers()['authorization']).toBe('Bearer '+token);
  const parsed=multipartRecord(route.request()),kind=route.request().url().split('/').at(-1)!;requests.push({kind,data:parsed.data});
  expect(parsed.body).toContain('filename="photo.png"');return route.fulfill({json:{id:requests.length,kind}});
 });
 await page.setViewportSize({width:390,height:844});await page.goto('/#/admin');await signIn(page);
 for(const [label,kind] of [['Nature','nature'],['Culture','culture'],['Food','food'],['Stories','story'],['Ads','ads']]){
  await page.getByRole('link',{name:new RegExp('Add '+label)}).click();const name=kind==='story'?'Story':kind==='ads'?'Ad':label;
  await expect(page.getByRole('heading',{name:'Add '+name,exact:true})).toBeVisible();await expect(page.locator('[formcontrolname="images"],[formcontrolname="imageUrl"]')).toHaveCount(0);
  const publish=page.getByRole('button',{name:'Publish '+name,exact:true});
  if(kind==='nature'){await publish.click();await expect(page.getByRole('alert')).toContainText('required fields');expect(requests).toHaveLength(0);}
  await page.getByLabel(kind==='story'||kind==='ads'?'Title':'Place name',{exact:false}).fill('New '+kind);
  if(['nature','culture','food'].includes(kind)){await page.getByLabel('Section').selectOption({index:1});await page.getByLabel('Website or map link').fill('https://example.invalid/place');}
  if(kind==='story'){await page.getByLabel('Author name').fill('Editor');await page.getByLabel('Contact email').fill('editor@example.invalid');await page.getByLabel('Story text').fill('A walk through Udupi.');}
  await page.getByLabel(kind==='ads'?'Ad image':'Record photos',{exact:true}).setInputFiles(photoFile());
  await expect(page.getByRole('group',{name:(kind==='ads'?'Ad image':'Record photos')+' gallery',exact:true}).locator('figure')).toHaveCount(1);
  expect(await page.locator('.panel input:visible, .panel select:visible, .panel textarea:visible').evaluateAll(nodes=>nodes.map(node=>{const field=node.getBoundingClientRect(),panel=node.closest('.panel')!.getBoundingClientRect();return {name:node.getAttribute('aria-label')||node.getAttribute('formcontrolname'),left:field.left,right:field.right,panelLeft:panel.left,panelRight:panel.right};}).filter(field=>field.left<field.panelLeft-1||field.right>field.panelRight+1))).toEqual([]);
  if(kind==='nature'){await page.getByText('Related places',{exact:false}).first().click();await page.getByRole('button',{name:'Add a related place'}).click();await page.getByRole('group',{name:'Related place 1',exact:true}).getByLabel('Name').fill('Nearby beach');await page.getByLabel('Related place 1 image',{exact:true}).setInputFiles(photoFile('related.png'));}
  await publish.click();await expect(page.getByRole('heading',{name:'Published successfully',exact:true})).toBeVisible();await page.getByRole('link',{name:'Return to dashboard'}).click();
 }
 expect(requests.map(r=>r.kind)).toEqual(['nature','culture','food','story','ads']);
 expect(requests[0].data.images[0]).toMatch(/^upload:/);expect(requests[0].data.dontMissThese[0].imageUrl).toMatch(/^upload:/);
 expect(requests[3].data).toMatchObject({submittedBy:'Editor',email:'editor@example.invalid'});expect(requests[4].data.imageUrl).toMatch(/^upload:/);
});

test('mobile Write to us opens the restored form and closes cleanly', async ({
  page,
}) => {
  await mockApi(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#/story');
  await expect(page.getByRole('status')).toContainText(
    'No stories have been published yet.',
  );
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('[data-bs-toggle="offcanvas"]')).toHaveCount(1);
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.getByRole('button', { name: 'Write to us' }).click();
  const form = page.getByRole('dialog', { name: 'Tell us your story' });
  await expect(form).toBeVisible();
  await expect(page.locator('.offcanvas-backdrop')).toHaveCount(0);
  await form.getByLabel('Name').fill('Fixture visitor');
  await form.getByLabel('Email').fill('fixture@example.invalid');
  await form.getByLabel('Your experience').fill('A day in Udupi');
  await form.getByLabel('Story title').fill('A day in Udupi');
  await expect(
    form.getByRole('button', { name: 'Submit story', exact: true }),
  ).toBeInViewport();
  await expect(
    form.getByRole('link', { name: 'Open email draft' }),
  ).toHaveCount(0);
  await form.getByRole('button', { name: 'Close story form' }).click();
  await expect(form).toBeHidden();
  await expect(page).toHaveURL(/#\/story$/);
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.getByRole('button', { name: 'Write to us' }).click();
  await expect(form).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(form).toBeHidden();
  await expect(
    page.locator('.modal-backdrop, .offcanvas-backdrop'),
  ).toHaveCount(0);
});

test('search loads one compact index on demand and legacy links stay in the same tab', async ({
  page,
  context,
}) => {
  await mockApi(page);
  const destination = {
    id: 42,
    name: 'Preview Lake',
    category: 'Nature',
    label: 'Best Of Nature',
    link: '/preview-lake',
    descr: 'Scenic shore',
    images: [],
    keyPoints: [],
    discover: [],
    impInfo: [],
    dontMissThese: [
      { name: 'Other Lake', description: 'A nearby stop', link: '/other-lake' },
      {
        name: 'Unknown stop',
        description: 'Read about this stop here',
        link: '/missing-stop',
      },
    ],
  };
  const listingReads: string[] = [];
  let indexReads = 0;
  page.on('request', (r) => {
    if (/\/v1\/(nature|food|culture)\/get/.test(r.url()))
      listingReads.push(r.url());
  });
  await page.route(api + '/v1/destination-search', (r) => {
    indexReads++;
    return r.fulfill({
      json: [
        {
          id: 42,
          name: 'Preview Lake',
          category: 'Nature',
          link: '/preview-lake',
          summary: 'Scenic shore',
        },
        { id: 43, name: 'Other Lake', category: 'Nature', link: '/other-lake' },
      ],
    });
  });
  let detailReads = 0;
  await page.route(api + '/v1/nature/42', (r) => {
    detailReads++;
    return r.fulfill({ json: destination });
  });
  await page.route(api + '/v1/nature/43', (r) =>
    r.fulfill({
      json: { ...destination, id: 43, name: 'Other Lake', dontMissThese: [] },
    }),
  );
  await page.goto('/#/home');
  await expect(
    page.getByRole('searchbox', { name: 'Search destinations' }),
  ).toBeVisible();
  expect(indexReads).toBe(0);
  expect(listingReads).toEqual([]);
  await page
    .getByRole('searchbox', { name: 'Search destinations' })
    .fill('preview');
  const result = page.getByRole('link', { name: /Preview Lake/ });
  await expect(result).toBeVisible();
  await result.click();
  await expect(page).toHaveURL(/#\/details\/nature\/42$/);
  await expect(page.getByText('Scenic shore')).toBeVisible();
  expect(indexReads).toBe(1);
  expect(detailReads).toBe(1);
  expect(listingReads).toEqual([]);
  await expect(page.getByRole('link', { name: 'View details' })).toHaveCount(1);
  await page.getByRole('link', { name: 'View details' }).click();
  await expect(page).toHaveURL(/#\/details\/nature\/43$/);
  expect(context.pages()).toHaveLength(1);
  await page.goto('/#/nature/preview-lake');
  await expect(page.getByText('Scenic shore')).toBeVisible();
  await page.goto('/#/dashboard');
  await expect(page).toHaveURL(/#\/admin\?access=required$/);
  await expect(
    page.getByText('Sign in as an administrator to open this page.'),
  ).toBeVisible();
});

test('search falls back only on demand when the backend has no index yet', async ({
  page,
}) => {
  await mockApi(page);
  let listingReads = 0;
  let indexReads = 0;
  await page.route(api + '/v1/destination-search', (r) => {
    indexReads++;
    return r.fulfill({ status: 401, json: {} });
  });
  for (const category of ['Nature', 'Culture', 'Food']) {
    await page.route(
      api + '/v1/' + category.toLowerCase() + '/get' + category,
      (r) => {
        listingReads++;
        return r.fulfill({
          json:
            category === 'Food'
              ? [{ id: 8, name: 'Market café', category }]
              : [],
        });
      },
    );
  }
  await page.goto('/#/home');
  const search = page.getByRole('searchbox', { name: 'Search destinations' });
  await expect(search).toBeVisible();
  expect(listingReads).toBe(0);
  await search.fill('market');
  await expect(page.getByRole('link', { name: /Market café/ })).toBeVisible();
  await search.fill('market café');
  await expect(page.getByRole('link', { name: /Market café/ })).toBeVisible();
  expect(indexReads).toBe(1);
  expect(listingReads).toBe(3);
});

test('collections support live search, filters, empty states and photo controls', async ({
  page,
}) => {
  await mockApi(page);
  const photo = '/assets/images/a6-480.jpg';
  const entries = [
    {
      id: 41,
      name: 'Forest walk',
      label: 'Trails',
      location: 'Udupi',
      descr: 'A quiet woodland walk.',
      images: [photo],
    },
    {
      id: 42,
      name: 'Coastal escape',
      label: 'Beaches',
      location: 'Malpe',
      descr: 'An afternoon by the sea.',
      images: [photo],
    },
  ];
  await page.route(api + '/v1/nature/getNature', (route) =>
    route.fulfill({ json: entries }),
  );
  await page.route(api + '/v1/nature/42', (route) =>
    route.fulfill({
      json: {
        ...entries[1],
        category: 'nature',
        images: [photo, '/assets/images/c2.jpg'],
        keyPoints: ['Bring water'],
        discover: [],
        impInfo: [],
        howToVisit: {
          byCar: 'Follow the coastal road',
          byPublic: 'Take a local bus',
          byBike: '',
        },
        timings: 'Check locally before visiting',
        dontMissThese: [],
        link: '',
      },
    }),
  );
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/#/nature');
  await expect(
    page.getByRole('status', { name: '' }).filter({ hasText: '2 places' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Beaches', exact: true }).click();
  await expect(page.getByRole('link', { name: /Forest walk/ })).toHaveCount(0);
  await expect(
    page.getByRole('button', { name: 'Beaches', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page
    .getByRole('searchbox', { name: 'Search nature', exact: true })
    .fill('missing');
  await expect(
    page.getByRole('heading', { name: 'No places match your search.' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(
    page.getByRole('searchbox', { name: 'Search nature', exact: true }),
  ).toHaveValue('');
  await page
    .getByRole('searchbox', { name: 'Search nature', exact: true })
    .fill('malpe');
  await page.getByRole('link', { name: /Coastal escape/ }).click();
  const mainImage = page.locator('.gallery-main');
  await expect(mainImage).toHaveAttribute('src', photo);
  await page.getByRole('button', { name: 'Next photo' }).click();
  await expect(mainImage).toHaveAttribute('src', '/assets/images/c2.jpg');
  await expect(page.getByRole('button', { name: 'Next photo' })).toBeDisabled();
  await page.getByRole('button', { name: 'Show photo 1' }).focus();
  await page.keyboard.press('Enter');
  await expect(mainImage).toHaveAttribute('src', photo);
  await page.getByText('By public transport', { exact: true }).click();
  await expect(
    page.getByText('Take a local bus', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Find on Google Maps' }),
  ).toHaveAttribute('href', /query=Coastal%20escape%20Malpe%20Udupi/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    360,
  );
});

test('redesigned pages fit narrow screens and respect reduced motion', async ({
  page,
}) => {
  await mockApi(page);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 360, height: 800 });
  for (const path of ['home', 'culture', 'food', 'story', 'advertisements']) {
    await page.goto('/#/' + path);
    await expect(page.locator('main.ud-page')).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(360);
    const animated = page.locator('.ud-enter').first();
    await expect(animated).toHaveCSS('animation-name', 'none');
  }
});

test('collection errors can be retried and larger collections reveal more cards', async ({
  page,
}) => {
  await mockApi(page);
  let attempts = 0;
  await page.route(api + '/v1/food/getFood', (route) => {
    if (++attempts === 1) return route.fulfill({ status: 503, json: {} });
    return route.fulfill({
      json: Array.from({ length: 13 }, (_, index) => ({
        id: index + 1,
        name: `Local stop ${index + 1}`,
        label: 'Tea & Snacks',
        location: 'Udupi',
        descr: 'A neighbourhood stop.',
        images: [],
      })),
    });
  });
  await page.goto('/#/food');
  await expect(page.getByRole('alert')).toContainText(
    'We couldn’t load these places.',
  );
  await page.getByRole('button', { name: 'Try again', exact: true }).click();
  await expect(
    page.getByRole('link', { name: /Explore this place/ }),
  ).toHaveCount(12);
  await page.getByRole('button', { name: 'Show more places' }).click();
  await expect(
    page.getByRole('link', { name: /Explore this place/ }),
  ).toHaveCount(13);
  await expect(
    page.getByRole('button', { name: 'Show more places' }),
  ).toHaveCount(0);
});

test('visitors submit up to three photos and retain their draft when submission fails', async ({
  page,
}) => {
  await mockApi(page);
  const photo = {
    name: 'coast.png',
    mimeType: 'image/png',
    buffer: Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP4n8AAAAPBAWBAxZYxAAAAAElFTkSuQmCC',
      'base64',
    ),
  };
  const keys: string[] = [];
  let attempts = 0;
  await page.route(api + '/v1/blogs/submissions', async (route) => {
    expect(route.request().headers()['authorization']).toBeUndefined();
    expect(route.request().headers()['content-type']).toContain(
      'multipart/form-data; boundary=',
    );
    const body = route.request().postDataBuffer()!.toString();
    expect(body).toContain('Coastal memories');
    expect(body).toContain('A visitor story to review.');
    expect(body.match(/filename=/g) || []).toHaveLength(3);
    keys.push(body.match(/name="submissionKey"\r\n\r\n([^\r]+)/)![1]);
    if (++attempts === 1)
      return route.fulfill({ status: 503, json: { detail: 'Unavailable' } });
    return route.fulfill({
      status: 201,
      json: { id: 42, message: 'Submitted' },
    });
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#/home');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.getByRole('button', { name: 'Write to us' }).click();
  const form = page.getByRole('dialog', { name: 'Tell us your story' });
  await form.getByLabel('Story title').fill('Coastal memories');
  await form.getByLabel('Name', { exact: true }).fill('Visitor');
  await form
    .getByLabel('Email', { exact: true })
    .fill('visitor@example.invalid');
  await form.getByLabel('Your experience').fill('A visitor story to review.');
  const files = form.getByLabel('Photos (optional)', { exact: true });
  await files.setInputFiles([
    photo,
    { ...photo, name: 'temple.png' },
    { ...photo, name: 'lunch.png' },
  ]);
  await expect(form.getByRole('img', { name: /Selected photo/ })).toHaveCount(
    3,
  );
  await files.setInputFiles({ ...photo, name: 'fourth.png' });
  await expect(form.getByRole('alert')).toContainText('up to 3');
  await expect(form.getByRole('img', { name: /Selected photo/ })).toHaveCount(
    3,
  );
  await form.getByRole('button', { name: 'Remove photo 3' }).click();
  await files.setInputFiles({ ...photo, name: 'replacement.png' });
  await form.getByRole('button', { name: 'Submit story', exact: true }).click();
  await expect(form.getByRole('alert')).toContainText(
    'Your draft is still here',
  );
  await expect(form.getByLabel('Your experience')).toHaveValue(
    'A visitor story to review.',
  );
  await expect(form.getByRole('img', { name: /Selected photo/ })).toHaveCount(
    3,
  );
  await form.getByRole('button', { name: 'Submit story', exact: true }).click();
  await expect(form.getByRole('status')).toContainText(
    'submitted for admin review',
  );
  expect(keys).toHaveLength(2);
  expect(keys[0]).toBe(keys[1]);
  await form.getByRole('button', { name: 'Done', exact: true }).click();
  await expect(form).toBeHidden();
});

test('admin reviews private submissions and publishes approved stories to the public page', async ({
  page,
}) => {
  await mockApi(page);
  const photo = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP4n8AAAAPBAWBAxZYxAAAAAElFTkSuQmCC',
    'base64',
  );
  const stories = [
    {
      id: 42,
      title: 'Coastal memories',
      content: 'Full visitor story awaiting approval.',
      submittedBy: 'Visitor',
      email: 'private@example.invalid',
      status: 'Submitted',
      createdAt: '2026-11-04 08:00:00',
      photos: ['/v1/blogs/photos/fixture-photo'],
    },
    {
      id: 43,
      title: 'Another submission',
      content: 'A second visitor contribution.',
      submittedBy: 'Another visitor',
      email: 'another@example.invalid',
      status: 'Submitted',
      createdAt: '2026-11-04 07:00:00',
      photos: [],
    },
  ];
  await page.route(api + '/v1/blogs/admin/**', async (route) => {
    expect(route.request().headers()['authorization']).toBe('Bearer ' + token);
    const url = new URL(route.request().url());
    const path = url.pathname;
    if (path.includes('/admin/photos/'))
      return route.fulfill({ contentType: 'image/png', body: photo });
    const match = path.match(/\/submissions\/(\d+)(?:\/(publish|reject))?$/);
    if (match) {
      const story = stories.find((s) => s.id === Number(match[1]))!;
      if (match[2]) {
        expect(route.request().method()).toBe('PATCH');
        story.status = match[2] === 'publish' ? 'Published' : 'Rejected';
        return route.fulfill({ json: { id: story.id, status: story.status } });
      }
      return route.fulfill({ json: story });
    }
    const items = stories
      .filter((s) => s.status === url.searchParams.get('status'))
      .map((s) => ({ ...s, excerpt: s.content, photoCount: s.photos.length }));
    return route.fulfill({
      json: {
        items,
        total: items.length,
        page: 0,
        totalPages: items.length ? 1 : 0,
      },
    });
  });
  await page.route(api + '/v1/blogs/getBlogs', (route) =>
    route.fulfill({
      json: stories
        .filter((s) => s.status === 'Published')
        .map(({ email, photos, ...s }) => ({
          ...s,
          images: photos,
          dontMissThese: [],
        })),
    }),
  );
  await page.route(api + '/v1/blogs/getBlogs/42', (route) => {
    const { email, photos, ...s } = stories[0];
    return route.fulfill({ json: { ...s, images: photos, dontMissThese: [] } });
  });
  await page.route(api + '/v1/blogs/photos/**', (route) =>
    route.fulfill({ contentType: 'image/png', body: photo }),
  );
  await page.goto('/#/story');
  await expect(page.getByRole('status')).toContainText(
    'No stories have been published yet.',
  );
  await page.goto('/#/admindashboard/stories');
  await expect(page).toHaveURL(/#\/admin(?:\?access=required)?$/);
  await signIn(page);
  await page.getByRole('link', { name: 'Review story submissions' }).click();
  await expect(
    page.getByRole('heading', { name: 'Story submissions', exact: true }),
  ).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: /Coastal memories/ }).click();
  const review = page.getByRole('region', { name: 'Story review' });
  await expect(
    review.getByText('Full visitor story awaiting approval.', { exact: true }),
  ).toBeVisible();
  await expect(
    review.getByText('private@example.invalid', { exact: true }),
  ).toBeVisible();
  await expect(
    review.getByRole('img', { name: 'Submitted photo 1', exact: true }),
  ).toBeVisible();
  await review
    .getByRole('button', { name: 'Publish story', exact: true })
    .click();
  await expect(
    page.getByRole('status').filter({ hasText: 'Story published' }),
  ).toContainText('Story published');
  await expect(
    page.getByRole('button', { name: /Coastal memories/ }),
  ).toHaveCount(0);
  await page.getByRole('button', { name: /Another submission/ }).click();
  await review
    .getByRole('button', { name: 'Reject story', exact: true })
    .click();
  await expect(
    page.getByRole('status').filter({ hasText: 'Story rejected' }),
  ).toContainText('Story rejected');
  await page.getByRole('button', { name: 'Rejected', exact: true }).click();
  await expect(
    page.getByRole('button', { name: /Another submission/ }),
  ).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
  await page.getByRole('link', { name: 'View public stories' }).click();
  await expect(
    page.getByRole('link', { name: /Coastal memories/ }),
  ).toBeVisible();
  await expect(
    page.getByText('Another submission', { exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByText('private@example.invalid', { exact: true }),
  ).toHaveCount(0);
  await page.getByRole('link', { name: /Coastal memories/ }).click();
  await expect(page).toHaveURL(/#\/story\/42$/);
  await expect(
    page.getByText('Full visitor story awaiting approval.', { exact: true }),
  ).toBeVisible();
  await expect(
    page
      .locator('img[src="' + api + '/v1/blogs/photos/fixture-photo"]')
      .first(),
  ).toBeVisible();
});


test('story form validates fields and photos inline before any submission',async({page})=>{
  let submissions=0;
  await mockApi(page);
  await page.route(api+'/v1/blogs/submissions',route=>{submissions++;return route.fulfill({status:201,json:{id:42}});});
  await page.setViewportSize({width:390,height:844});await page.goto('/#/home');
  await page.getByRole('button',{name:'Open navigation'}).click();await page.getByRole('button',{name:'Write to us'}).click();
  const form=page.getByRole('dialog',{name:'Tell us your story'});
  const submit=form.getByRole('button',{name:'Submit story',exact:true});
  await submit.click();
  await expect(form.getByLabel('Story title')).toBeFocused();
  for(const id of ['title','name','email','message'])await expect(form.locator('#story-'+id+'-error')).toContainText('Enter your');
  expect(submissions).toBe(0);
  await form.getByLabel('Story title').fill('   ');await form.getByLabel('Name',{exact:true}).fill('Visitor');await form.getByLabel('Email',{exact:true}).fill('visitor@example');await form.getByLabel('Your experience').fill('A walk in Udupi.');
  await submit.click();await expect(form.locator('#story-title-error')).toBeVisible();await expect(form.locator('#story-email-error')).toContainText('valid email');expect(submissions).toBe(0);
  await form.getByLabel('Story title').fill('A day in Udupi');await form.getByLabel('Email',{exact:true}).fill('visitor@example.com');
  const photos=form.getByLabel('Photos (optional)',{exact:true});
  await photos.setInputFiles({name:'notes.txt',mimeType:'text/plain',buffer:Buffer.from('not a photo')});
  await expect(form.locator('#story-photo-error')).toContainText('JPEG or PNG');await submit.click();expect(submissions).toBe(0);
  await photos.setInputFiles({name:'fake.png',mimeType:'image/png',buffer:Buffer.from('not an actual image')});
  await expect(form.locator('#story-photo-error')).toContainText('readable JPEG or PNG');
  await photos.setInputFiles({name:'oversized.png',mimeType:'image/png',buffer:Buffer.alloc(5*1024*1024+1)});
  await expect(form.locator('#story-photo-error')).toContainText('5 MB');expect(submissions).toBe(0);
  await form.getByRole('button',{name:'Continue without photos'}).click();
  await expect(form.locator('#story-photo-error')).toHaveCount(0);await submit.click();
  await expect(form.getByRole('status')).toContainText('submitted for admin review');expect(submissions).toBe(1);
});

test('admin adds photos to a received story, retries safely and publishes the saved gallery',async({page})=>{
  await mockApi(page);

  // Generate a valid image in the browser for the real client-side decoder.
  await page.goto('/#/admin');
  const encoded=await page.evaluate(()=>{const canvas=document.createElement('canvas');canvas.width=4;canvas.height=4;return canvas.toDataURL('image/png').split(',')[1];});
  const photo={name:'admin-coast.png',mimeType:'image/png',buffer:Buffer.from(encoded,'base64')};
  const story={id:84,title:'Received visitor story',content:'A visitor memory for admin review.',submittedBy:'Visitor',email:'private@example.invalid',createdAt:'2026-11-04 09:00:00',status:'Submitted',photos:['/v1/blogs/photos/visitor-photo']};
  let uploads=0;const keys:string[]=[];
  await page.route(api+'/v1/blogs/admin/**',async route=>{
    expect(route.request().headers()['authorization']).toBe('Bearer '+token);
    const path=new URL(route.request().url()).pathname;
    if(path.includes('/admin/photos/'))return route.fulfill({contentType:'image/png',body:photo.buffer});
    if(path.endsWith('/submissions/84/photos')){
      expect(route.request().method()).toBe('POST');
      const body=route.request().postDataBuffer()!.toString();expect(body.match(/filename=/g)||[]).toHaveLength(2);
      keys.push(body.match(/name="uploadKey"\r\n\r\n([^\r]+)/)![1]);
      if(++uploads===1)return route.fulfill({status:503,json:{detail:'Unavailable'}});
      story.photos.push('/v1/blogs/photos/admin-photo-1','/v1/blogs/photos/admin-photo-2');return route.fulfill({json:story});
    }
    if(path.endsWith('/submissions/84/publish')){story.status='Published';return route.fulfill({json:{id:84,status:'Published'}});}
    if(path.endsWith('/submissions/84'))return route.fulfill({json:story});
    return route.fulfill({json:{items:story.status==='Submitted'?[{...story,excerpt:story.content,photoCount:story.photos.length}]:[],total:story.status==='Submitted'?1:0,page:0,totalPages:1}});
  });
  await page.route(api+'/v1/blogs/getBlogs/84',route=>{const {email,photos,...publicStory}=story;return route.fulfill({json:{...publicStory,images:photos,dontMissThese:[]}});});
  await page.route(api+'/v1/blogs/photos/**',route=>route.fulfill({contentType:'image/png',body:photo.buffer}));
  await signIn(page);await page.getByRole('link',{name:'Review story submissions'}).click();
  await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:/Received visitor story/}).click();
  const review=page.getByRole('region',{name:'Story review'});const input=review.getByLabel('Add photos (optional)',{exact:true});
  await input.setInputFiles([photo,{...photo,name:'second.png'},{...photo,name:'third.png'}]);
  await expect(review.locator('#admin-photo-error')).toContainText('up to 3');expect(uploads).toBe(0);
  await input.setInputFiles([photo,{...photo,name:'second.png'}]);
  await expect(review.getByRole('img',{name:/New photo/})).toHaveCount(2);
  await expect(review.getByRole('button',{name:'Publish story',exact:true})).toBeDisabled();
  await review.getByRole('button',{name:'Remove new photo 2'}).click();
  await input.setInputFiles({...photo,name:'replacement.png'});
  await review.getByRole('button',{name:'Save photos',exact:true}).click();
  await expect(review.getByRole('alert')).toContainText('Your selection is still here');
  await expect(review.getByRole('img',{name:/New photo/})).toHaveCount(2);
  await review.getByRole('button',{name:'Save photos',exact:true}).click();
  await expect(page.getByRole('status').filter({hasText:'Photos saved'})).toBeVisible();
  await expect(review.getByRole('img',{name:/Submitted photo/})).toHaveCount(3);
  await expect(review.getByRole('img',{name:/New photo/})).toHaveCount(0);
  expect(keys).toHaveLength(2);expect(keys[0]).toBe(keys[1]);
  await expect(review.getByText('This story has reached the three-photo limit.')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(390);
  await review.getByRole('button',{name:'Publish story',exact:true}).click();
  await review.getByRole('link',{name:'View published story'}).click();
  await expect(page).toHaveURL(/#\/story\/84$/);
  await expect(page.getByRole('button',{name:/Show photo/})).toHaveCount(3);
  await expect(page.getByText('private@example.invalid',{exact:true})).toHaveCount(0);
});

test('visitor motion follows the pointer, tracks scrolling and stops for reduced motion',async({page})=>{
  await mockApi(page);await page.emulateMedia({reducedMotion:'no-preference'});await page.setViewportSize({width:1440,height:900});
  await page.goto('/#/home');
  const root=page.locator('main[udMotion]');
  await expect(root.locator('.ud-reading-progress')).toHaveCount(1);
  const hero=page.getByRole('link',{name:'Explore nature in Udupi',exact:true});
  await hero.hover();await expect(hero).toHaveClass(/ud-spotlight-active/);
  expect(await hero.evaluate(el=>el.style.getPropertyValue('--ud-pointer-x'))).not.toBe('');
  await page.getByRole('link',{name:'Explore local ads'}).scrollIntoViewIfNeeded();
  await expect.poll(()=>root.evaluate(el=>Number(el.style.getPropertyValue('--ud-scroll')))).toBeGreaterThan(.5);
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(root.locator('.ud-reading-progress')).toHaveCount(0);
  await expect(hero).not.toHaveClass(/ud-spotlight-active/);
  await expect.poll(()=>root.evaluate(el=>el.getAnimations({subtree:true}).filter(a=>a.playState==='running').length)).toBe(0);
  await expect(page.getByRole('heading',{name:'Many sides. One Udupi.'})).toBeVisible();
  for(const path of ['culture','food','story']){
    await page.goto('/#/'+path);await expect(page.locator('main[udMotion]')).toBeVisible();await expect(page.locator('.ud-reading-progress')).toHaveCount(0);
  }
  await page.emulateMedia({reducedMotion:'no-preference'});await expect(page.locator('.ud-reading-progress')).toHaveCount(1);
  await page.goto('/#/home');await expect(page.locator('.ud-reading-progress')).toHaveCount(1);
});

test('newly loaded collection cards reveal without blocking search or keyboard navigation',async({page})=>{
  await mockApi(page);await page.emulateMedia({reducedMotion:'no-preference'});
  let release!:()=>void;const responseReady=new Promise<void>(resolve=>{release=resolve;});
  await page.route(api+'/v1/nature/getNature',async route=>{await responseReady;return route.fulfill({json:[
    {id:41,name:'Coastal walk',label:'Beaches',location:'Udupi',descr:'A coast to explore.',images:[]},
    {id:42,name:'Forest trail',label:'Trails',location:'Udupi',descr:'A trail to discover.',images:[]},
  ]});});
  await page.goto('/#/nature');await expect(page.getByRole('status').filter({hasText:'Loading places'})).toBeVisible();release();
  const card=page.getByRole('link',{name:/Coastal walk/});
  await expect(card).toBeVisible();
  await expect.poll(()=>card.evaluate(el=>el.getAnimations().filter(a=>a.playState==='running').length)).toBeGreaterThan(0);
  await card.focus();await expect(card).toBeFocused();
  await expect.poll(()=>card.evaluate(el=>el.getAnimations().filter(a=>a.playState==='running').length)).toBe(0);
  await page.getByRole('searchbox',{name:'Search nature',exact:true}).fill('forest');
  await expect(page.getByRole('link',{name:/Forest trail/})).toBeVisible();await expect(card).toHaveCount(0);
  await page.getByRole('searchbox',{name:'Search nature',exact:true}).fill('');
  await expect(card).toBeVisible();await expect(page.getByRole('link',{name:/Forest trail/})).toBeVisible();
});

test('visitor content remains usable without IntersectionObserver support',async({page})=>{
  await page.addInitScript(()=>{Object.defineProperty(window,'IntersectionObserver',{value:undefined,configurable:true});});
  await mockApi(page);await page.goto('/#/home');
  await expect(page.getByRole('heading',{name:/A little closer/})).toBeVisible();
  await expect(page.getByRole('link',{name:'Explore nature in Udupi',exact:true})).toBeVisible();
  await expect(page.locator('.ud-reading-progress')).toHaveCount(0);
  await page.getByRole('link',{name:'Explore nature in Udupi',exact:true}).click();await expect(page).toHaveURL(/#\/nature$/);
  await expect(page.getByRole('heading',{name:'A breath of fresh air.'})).toBeVisible();
});

test('dashboard edit cards open prefilled forms and save all five existing record types',async({page})=>{
 await mockApi(page);const saves:any[]=[];
 const headers={'access-control-allow-origin':'*','access-control-allow-headers':'authorization, content-type','access-control-allow-methods':'GET,PUT,OPTIONS'};
 const destination=(kind:string)=>({id:41,name:'Existing '+kind,category:kind[0].toUpperCase()+kind.slice(1),label:'Legacy section',location:'Udupi',descr:'Saved description',link:'/old-record',images:['/assets/original.jpg'],keyPoints:['Existing highlight'],discover:[],impInfo:[],dontMissThese:[{name:'Related place',description:'Related content',imageUrl:'',link:'/related'}],howToVisit:{byBike:'Cycle path',byCar:'Road',byPublic:'Bus'},timings:'Morning'});
 for(const kind of ['nature','culture','food']){
  await page.route(api+'/v1/'+kind+'/get'+kind[0].toUpperCase()+kind.slice(1),route=>route.fulfill({headers,json:[destination(kind)]}));
  await page.route(api+'/v1/'+kind+'/41',route=>route.fulfill({headers,json:destination(kind)}));
 }
 const story={id:41,title:'Existing story',content:'A previously published experience.',submittedBy:'Original author',status:'Published',images:['/assets/story.jpg'],dontMissThese:[],link:''};
 await page.route(api+'/v1/blogs/getBlogs',route=>route.fulfill({headers,json:[story]}));
 await page.route(api+'/v1/blogs/admin/content/41',route=>{expect(route.request().headers()['authorization']).toBe('Bearer '+token);return route.fulfill({headers,json:{content:story,email:'author@example.invalid'}});});
 const ad={id:41,title:'Existing ad',imageUrl:'https://example.invalid/ad.jpg',link:'https://example.invalid/shop'};
 await page.route(api+'/v1/ads',route=>route.fulfill({headers,json:[ad]}));await page.route(api+'/v1/ads/41',route=>route.fulfill({headers,json:ad}));
 await page.route(api+'/v1/admin/content/*/41',route=>{
  expect(route.request().method()).toBe('POST');expect(route.request().headers()['authorization']).toBe('Bearer '+token);const body=multipartRecord(route.request()).data;saves.push({path:route.request().url(),body});return route.fulfill({json:{id:41}});
 });
 await page.goto('/#/admin');await signIn(page);
 for(const [label,kind] of [['Nature','nature'],['Culture','culture'],['Food','food'],['Stories','story'],['Ads','ads']]){
  await page.getByRole('link',{name:new RegExp('Edit '+label)}).click();await expect(page.getByRole('heading',{name:'Edit '+label,exact:true})).toBeVisible();
  const recordName=kind==='story'?'Existing story':kind==='ads'?'Existing ad':'Existing '+kind;
  await page.getByRole('link',{name:'Edit '+recordName,exact:true}).click();
  const title=page.getByLabel(kind==='story'||kind==='ads'?'Title':'Place name');await expect(title).toHaveValue(recordName);await title.fill('Updated '+kind);
  if(kind==='story'){await expect(page.getByLabel('Contact email')).toHaveValue('author@example.invalid');await expect(page.getByLabel('Author name')).toHaveValue('Original author');}
  if(!['story','ads'].includes(kind)){await expect(page.getByLabel('Section')).toHaveValue('Legacy section');await expect(page.getByRole('group',{name:'Record photos gallery',exact:true}).locator('figure')).toHaveCount(1);}
  await page.getByRole('button',{name:'Save changes',exact:true}).click();await expect(page.getByRole('heading',{name:'Changes saved',exact:true})).toBeVisible();await page.getByRole('link',{name:'Return to dashboard'}).click();
 }
 expect(saves).toHaveLength(5);expect(saves[0].body).toMatchObject({name:'Updated nature',keyPoints:['Existing highlight'],images:['/assets/original.jpg'],dontMissThese:[{name:'Related place'}]});expect(saves[3].body).toMatchObject({title:'Updated story',status:'Published',email:'author@example.invalid',images:['/assets/story.jpg']});expect(saves[4].body).toMatchObject({title:'Updated ads',imageUrl:'https://example.invalid/ad.jpg'});
});

test('visitors browse upcoming and past events without changing the home page',async({page})=>{
 await mockApi(page);const events=[{id:1,details:{article:{name:'Coastal music',location:'Malpe',descr:'Music by the sea.',images:['assets/images/a6.jpg'],link:'https://example.invalid/event'},startsOn:'2099-12-10',endsOn:'2099-12-10'}},{id:2,details:{article:{name:'Heritage gathering'},startsOn:'2020-01-01',endsOn:'2020-01-02'}}];
 await page.route(api+'/v1/events',route=>route.fulfill({json:events}));await page.route(api+'/v1/events/1',route=>route.fulfill({json:events[0]}));
 await page.setViewportSize({width:390,height:844});await page.goto('/#/home');await expect(page.locator('.home-editorial')).toHaveCount(0);await page.getByRole('button',{name:'Open navigation'}).click();await page.getByRole('dialog',{name:'Explore Udupi'}).getByRole('link',{name:'Events',exact:true}).click();
 const upcoming=page.locator('section').filter({has:page.getByRole('heading',{name:'Upcoming & announced',exact:true})});const past=page.locator('section').filter({has:page.getByRole('heading',{name:'Past events',exact:true})});await expect(upcoming).toContainText('Coastal music');await expect(upcoming).not.toContainText('Heritage gathering');await expect(past).toContainText('Heritage gathering');await upcoming.getByRole('link').click();await expect(page.getByRole('heading',{name:'Coastal music',exact:true})).toBeVisible();await expect(page.getByText('Music by the sea.')).toBeVisible();await expect(page.getByRole('link',{name:'Event website ↗'})).toHaveAttribute('href','https://example.invalid/event');await expect(page.locator('body')).toHaveJSProperty('scrollWidth',390);
});

test('admin saves five event photos atomically and retries an uncertain response safely',async({page})=>{
 await mockApi(page);let attempts=0;const keys:string[]=[];const payloads:any[]=[];
 await page.route(api+'/v1/admin/content/events',route=>{
  expect(route.request().headers()['authorization']).toBe('Bearer '+token);attempts++;const parsed=multipartRecord(route.request());keys.push(parsed.key);payloads.push(parsed.data);expect((parsed.body.match(/filename="photo/g)||[]).length).toBe(5);return route.fulfill({status:attempts===1?503:200,json:{id:81,kind:'events'}});
 });
 await page.goto('/#/admin');await signIn(page);await page.getByRole('link',{name:/Add Events/}).click();await page.getByLabel('Title').fill('Music in Udupi');await page.getByLabel('Start date').fill('2099-11-10');await page.getByLabel('End date').fill('2099-11-11');
 const photos=page.getByLabel('Record photos',{exact:true});await photos.setInputFiles(Array.from({length:6},(_,i)=>photoFile('photo'+i+'.png')));await expect(page.getByRole('alert')).toContainText('up to 5');expect(attempts).toBe(0);
 await photos.setInputFiles(Array.from({length:5},(_,i)=>photoFile('photo'+i+'.png')));await page.getByRole('button',{name:'Publish Event',exact:true}).click();await expect(page.getByRole('alert')).toContainText('Saving could not be confirmed');await expect(page.getByLabel('Title')).toBeDisabled();
 await page.getByRole('button',{name:'Publish Event',exact:true}).click();await expect(page.getByRole('heading',{name:'Published successfully'})).toBeVisible();expect(attempts).toBe(2);expect(keys[0]).toBe(keys[1]);expect(payloads[0]).toEqual(payloads[1]);expect(payloads[0].article.images).toHaveLength(5);
});

test('animated loading page clears after success and failure and respects reduced motion',async({page})=>{
 await mockApi(page);let release!:()=>void;const pending=new Promise<void>(resolve=>release=resolve);
 await page.route(api+'/v1/nature/getNature',async route=>{await pending;await route.fulfill({json:[]});});
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/#/nature');const loader=page.getByRole('status',{name:'Loading content',exact:true});await expect(loader).toBeVisible();await expect(loader.locator('.orbit-one')).toHaveCSS('animation-name','none');release();await expect(loader).toBeHidden();
 let fail!:()=>void;const failed=new Promise<void>(resolve=>fail=resolve);await page.route(api+'/v1/food/getFood',async route=>{await failed;await route.fulfill({status:503,json:{}});});await page.getByRole('link',{name:'Food',exact:true}).first().click();await expect(loader).toBeVisible();await expect(page.getByRole('heading',{name:'Follow your appetite.'})).toBeVisible();await expect(page.getByRole('link',{name:'Udupi Darshan Logo'})).toBeEnabled();fail();await expect(loader).toBeHidden();await expect(page.getByRole('alert')).toBeVisible();
});

test('admin removes and replaces saved images, chooses a main photo and saves the final gallery',async({page})=>{
 await mockApi(page);let saved:any;const original={id:51,name:'Beach record',category:'Nature',label:'Beach List',link:'/beach',images:['assets/images/a6.jpg','assets/images/c2.jpg'],keyPoints:[],discover:[],impInfo:[],dontMissThese:[],howToVisit:null};
 await page.route(api+'/v1/nature/getNature',r=>r.fulfill({json:[original]}));await page.route(api+'/v1/nature/51',r=>r.fulfill({json:original}));await page.route(api+'/v1/admin/content/nature/51',r=>{saved=multipartRecord(r.request()).data;return r.fulfill({json:{id:51,kind:'nature'}});});
 await page.goto('/#/admin');await signIn(page);await page.getByRole('link',{name:/Edit Nature/}).click();await page.getByRole('link',{name:'Edit Beach record',exact:true}).click();const gallery=page.getByRole('group',{name:'Record photos gallery',exact:true});await expect(gallery.locator('figure')).toHaveCount(2);
 await gallery.getByRole('button',{name:'Remove record photos photo 1',exact:true}).click();await expect(gallery.locator('figure')).toHaveCount(1);await page.getByLabel('Record photos',{exact:true}).setInputFiles(photoFile());await expect(gallery.locator('figure')).toHaveCount(2);await gallery.getByRole('button',{name:'Use record photos photo 2 as main',exact:true}).click();await page.getByRole('button',{name:'Save changes',exact:true}).click();await expect(page.getByRole('heading',{name:'Changes saved'})).toBeVisible();expect(saved.images).toHaveLength(2);expect(saved.images[0]).toMatch(/^upload:/);expect(saved.images[1]).toBe('assets/images/c2.jpg');expect(saved.images).not.toContain('assets/images/a6.jpg');
});

test('removing an advertisement image requires a replacement before saving',async({page})=>{
 await mockApi(page);let saves=0;const ad={id:17,title:'Local ad',imageUrl:'assets/images/c2.jpg',link:''};await page.route(api+'/v1/ads',r=>r.fulfill({json:[ad]}));await page.route(api+'/v1/ads/17',r=>r.fulfill({json:ad}));await page.route(api+'/v1/admin/content/ads/17',r=>{saves++;expect(multipartRecord(r.request()).data.imageUrl).toMatch(/^upload:/);return r.fulfill({json:{id:17}});});
 await page.goto('/#/admin');await signIn(page);await page.getByRole('link',{name:/Edit Ads/}).click();await page.getByRole('link',{name:'Edit Local ad',exact:true}).click();await page.getByRole('button',{name:'Remove ad image photo 1',exact:true}).click();await page.getByRole('button',{name:'Save changes'}).click();await expect(page.getByRole('alert')).toContainText('Choose an image');expect(saves).toBe(0);await page.getByLabel('Ad image',{exact:true}).setInputFiles(photoFile());await page.getByRole('button',{name:'Save changes'}).click();await expect(page.getByRole('heading',{name:'Changes saved'})).toBeVisible();expect(saves).toBe(1);
});
