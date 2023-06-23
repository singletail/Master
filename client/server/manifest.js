const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.b5a6d0a7.js","app":"_app/immutable/entry/app.c16ce698.js","imports":["_app/immutable/entry/start.b5a6d0a7.js","_app/immutable/chunks/scheduler.e108d1fd.js","_app/immutable/chunks/singletons.171762a4.js","_app/immutable/entry/app.c16ce698.js","_app/immutable/chunks/scheduler.e108d1fd.js","_app/immutable/chunks/index.0719bd3d.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			() => import('./chunks/0-b619ffc2.js'),
			() => import('./chunks/1-8bacc474.js'),
			() => import('./chunks/2-74eeeec0.js')
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
};

const prerendered = new Set([]);

export { manifest, prerendered };
//# sourceMappingURL=manifest.js.map
