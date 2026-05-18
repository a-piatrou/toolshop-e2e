import type { Page } from '@playwright/test';

export abstract class BasePage {
  protected constructor(
    protected readonly page: Page,
    protected readonly path: string,
  ) {}

  async open(path: string = this.path): Promise<void> {
    await this.page.goto(path);
  }
}
