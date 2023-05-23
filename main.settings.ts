export interface SamplePluginSettings {
	hush: {
		guid: string;
		secret: string;
		code: string;
		salt: string;
	}
}

export const defaultSamplePluginSettings: SamplePluginSettings = {
	hush: {
		guid: '',
		secret: '',
		code: '',
		salt: '',
	}
};
