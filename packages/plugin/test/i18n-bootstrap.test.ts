import Bootstrap from '@/modules/Bootstrap';
import I18n from '@/modules/I18n';
import { expect, spyOn, test } from 'bun:test';
import * as obsidian from 'obsidian';

test.each([
	['zh', '开始同步', '非信任模块'],
	['zh-CN', '开始同步', '非信任模块'],
	['zh-TW', '開始同步', '非信任模組'],
	['zh-Hant-HK', '開始同步', '非信任模組'],
	['ru', 'Запустить синхронизацию', 'Модуль из недоверенного источника'],
	['fr', 'Start sync', 'Untrusted module'],
])(
	'loads built-in UI translations for %s without installing a module',
	(locale, start, warning) => {
		const language = spyOn(obsidian, 'getLanguage').mockReturnValue(locale);
		try {
			const i18n = new I18n();
			new Bootstrap({ registerI18n: i18n.root.registerI18n } as ConstructorParameters<
				typeof Bootstrap
			>[0]);
			expect<unknown>(i18n.root.translate('startSync')).toBe(start);
			expect<unknown>(i18n.root.translate('untrustedModule')).toBe(warning);
		} finally {
			language.mockRestore();
		}
	},
);
