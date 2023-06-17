declare module 'gh-pages' {
	/**
	 * Calling this function will create a temporary clone of the current repository, create a `gh-pages` branch if one doesn't already exist, copy over all files from the base path, or only those that match patterns from the optional `src` configuration, commit all changes, and push to the `origin` remote.
	 * If a `gh-pages` branch already exists, it will be updated with all commits from the remote before adding any commits from the provided `src` files.
	 * **Note** that any files in the `gh-pages` branch that are *not* in the `src` files **will be removed**.  See the [`add` option](https://github.com/tschaub/gh-pages/blob/main/readme.md#optionsadd) if you don't want any of the existing files removed.
	 */
	interface PublishOptions {
		src?: string | string[];
		branch?: string;
		dest?: string;
		dotfiles?: boolean;
		add?: boolean;
		repo?: string;
		remote?: string;
		tag?: string;
		message?: string;
		user?: {
			name: string;
			email: string;
		};
		remove?: string;
		push?: boolean;
		history?: boolean;
		silent?: boolean;
		beforeAdd?: (git: any) => Promise<void> | void;
		git?: string;
	}

	export function publish(
		dir: string,
		options?: PublishOptions,
		//callback: (err?: Error) => void
	): Promise<unknown>;
}