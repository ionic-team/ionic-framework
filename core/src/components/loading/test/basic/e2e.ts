import { testLoading } from '../test.utils';

const DIRECTORY = 'basic';

test('loading: basic', async () => {
  await testLoading(DIRECTORY, '#basic-loading');
});

test('loading: long content basic', async () => {
  await testLoading(DIRECTORY, '#long-content-loading');
});

test('loading: no spinner basic', async () => {
  await testLoading(DIRECTORY, '#no-spinner-loading');
});

test('loading: translucent basic', async () => {
  await testLoading(DIRECTORY, '#translucent-loading');
});

test('loading: custom class basic', async () => {
  await testLoading(DIRECTORY, '#custom-class-loading');
});

test('loading: backdrop standalone', async () => {
  await testLoading(DIRECTORY, '#backdrop-loading');
});

test('loading: html content basic', async () => {
  await testLoading(DIRECTORY, '#html-content-loading');
});

/**
 * RTL Tests
 */

test('loading:rtl: basic basic', async () => {
  await testLoading(DIRECTORY, '#basic-loading', true);
});

test('loading:rtl: long content basic', async () => {
  await testLoading(DIRECTORY, '#long-content-loading', true);
});

test('loading:rtl: no spinner basic', async () => {
  await testLoading(DIRECTORY, '#no-spinner-loading', true);
});

test('loading:rtl: translucent basic', async () => {
  await testLoading(DIRECTORY, '#translucent-loading', true);
});

test('loading:rtl: custom class basic', async () => {
  await testLoading(DIRECTORY, '#custom-class-loading', true);
});

test('loading:rtl: backdrop standalone', async () => {
  await testLoading(DIRECTORY, '#backdrop-loading', true);
});

test('loading:rtl: html content basic', async () => {
  await testLoading(DIRECTORY, '#html-content-loading', true);
});
