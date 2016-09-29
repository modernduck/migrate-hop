import { MigrateHopPage } from './app.po';

describe('migrate-hop App', function() {
  let page: MigrateHopPage;

  beforeEach(() => {
    page = new MigrateHopPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
