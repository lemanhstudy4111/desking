// Source - https://stackoverflow.com/a/53981706
// Posted by Karol Majewski, modified by community. See post 'Timeline' for change history
// Retrieved 2026-04-26, License - CC BY-SA 4.0

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: "development" | "production";
			PORT?: string;
			DATABASE_URL: string;
			DATABASE_HOST: string;
			DATABASE_PORT: Number;
			DATABASE: string;
			USER: string;
			APP_PORT: Number;
		}
	}
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
