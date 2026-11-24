import Extensibility, { OFFICIAL_SOURCE } from '@/modules/Extensibility';
import { expect, test } from 'bun:test';
import type { ModuleMeta } from '@/modules/Extensibility';

test('KnSync uses the inherited core version only for the upstream module catalog', async () => {
	const thirdPartySource = 'https://example.com/modules.json';
	const webdav: ModuleMeta = {
		id: 'webdav',
		name: 'WebDAV',
		description: 'WebDAV backend',
		main: 'https://example.com/webdav.js',
		version: '1.1.1',
		integrity: 'a'.repeat(64),
		minPluginVersion: '3.4.3',
	};
	const context = {
		manifest: { version: '1.0.0', dir: '.obsidian/plugins/knsync' },
		app: { vault: { getName: () => 'KnSync test' } },
		indexedDB: { getStore: () => ({}) },
		dispatch: () => {},
	} as unknown as ConstructorParameters<typeof Extensibility>[0];
	const modules = new Extensibility(context);
	Object.assign(modules, {
		settings: { moduleSources: [OFFICIAL_SOURCE, thirdPartySource] },
		sourceCache: new Map([
			[
				OFFICIAL_SOURCE,
				[webdav, { ...webdav, id: 'newer-upstream-module', minPluginVersion: '3.4.4' }],
			],
			[thirdPartySource, [{ ...webdav, id: 'third-party-module' }]],
		]),
	});
	try {
		const result = await modules.root.fetchSources();
		expect(result.map(({ id, source }) => ({ id, source }))).toStrictEqual([
			{ id: 'webdav', source: OFFICIAL_SOURCE },
		]);
	} finally {
		modules.dispose();
	}
});
