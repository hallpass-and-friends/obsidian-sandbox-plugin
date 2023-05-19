import { Plugin } from 'obsidian';

import CsvEditor from 'features/csv-editor';
import FeaturesAbstract from 'features/features.abstract';
import TrackLines from 'features/track-lines';
import KvpEditor from 'features/key-value-pair/kvp-editor';

export default class SandboxPlugin extends Plugin {
	features: FeaturesAbstract[];

	onload() {
			this.features = [
				new TrackLines(this),
				new CsvEditor(this),
				new KvpEditor(this),
			];

			this.features.forEach(feature => {
				feature.onload();
			});
	}

	onunload(): void {
		this.features.forEach(feature => {
			feature.onunload();
		});
	}

	
}