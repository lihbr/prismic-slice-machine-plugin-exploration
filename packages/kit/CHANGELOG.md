# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### 0.0.1 (2022-07-08)


### Features

* 🍊 ([9d92960](https://github.com/prismicio/slice-machine-plugin/commit/9d9296027056a26bbcfc5fa99e001113fc93c469))
* 🍋 ([045049d](https://github.com/prismicio/slice-machine-plugin/commit/045049d70dd01816631f4dacb01c5b1bea1260fa))
* 🍣 ([2d8ad2e](https://github.com/prismicio/slice-machine-plugin/commit/2d8ad2e59ece489a2be8ef0ad26f2791b7c03439))
* accept a plugin module using the `resolve` property ([db04d74](https://github.com/prismicio/slice-machine-plugin/commit/db04d7428d564fc8b284f8b4da1795728a2dfe10))
* add `<SliceSimulator>` ([582efb9](https://github.com/prismicio/slice-machine-plugin/commit/582efb92187814f56c64fe59f96e43b9882e3d21))
* add basic error traceability ([02e2ba5](https://github.com/prismicio/slice-machine-plugin/commit/02e2ba5e756135f4db73ddb20faef2e31c8b2344))
* add hook IDs ([5023aa0](https://github.com/prismicio/slice-machine-plugin/commit/5023aa0d1847edc8c6f2fd4b352ea4db8422550b))
* add remaining `adapter-next` hooks ([9f1bc90](https://github.com/prismicio/slice-machine-plugin/commit/9f1bc90bfc2b13489a7d5f1f833466241ddc722e))
* **kit:** add `SliceMachinePluginRunner` class ([9ed2aac](https://github.com/prismicio/slice-machine-plugin/commit/9ed2aac340afd0914ce62a73ed3bd29f1941d6c2))
* migrate adapter-next ([24f2e80](https://github.com/prismicio/slice-machine-plugin/commit/24f2e8034e6bba95e337d358edc8db9590f72eb0))
* prevent plugins from hooking to certain hook ([7073611](https://github.com/prismicio/slice-machine-plugin/commit/70736114b89d5f6cc6468dbd9f1cfbf48678d683))
* rework plugin runner API for easier use and testing ([1169e01](https://github.com/prismicio/slice-machine-plugin/commit/1169e01946a7e0061c765c95c13d1d977d8cd632))
* update plugin kit exports ([b99c66d](https://github.com/prismicio/slice-machine-plugin/commit/b99c66d5bcc89f19f90055aa768c70661404e938))


### Bug Fixes

* `HookSystem.unhook` + tests ([244b236](https://github.com/prismicio/slice-machine-plugin/commit/244b2361fef70f3647a2603adb77ad6bcb9e468c))
* correct customType hook return types ([5962ae3](https://github.com/prismicio/slice-machine-plugin/commit/5962ae3e8a5201e379627eaa2cbfdda6a749a634))
* jsdoc Slice component type location ([11953ce](https://github.com/prismicio/slice-machine-plugin/commit/11953ce11cc4493627ef672bf920fcf9a77b8a03))
* remove `preCode` and `postCode` snippet properties ([60b47a8](https://github.com/prismicio/slice-machine-plugin/commit/60b47a8f9fc8f690c996bf50bb0f7a01d20fed59))
* type forwarded `HookSystem` methods ([c0a7c2d](https://github.com/prismicio/slice-machine-plugin/commit/c0a7c2dd5bd3213cd4df04d5afecf36bcd715a20))


### Chore

* cleanup ([3bfc822](https://github.com/prismicio/slice-machine-plugin/commit/3bfc8227c8af5370b2a9bef29a236391d02fc7b7))
* cleanup tmp code ([a68b612](https://github.com/prismicio/slice-machine-plugin/commit/a68b6124fc1d3a95f1f1a16a13fb2eae82177602))
* **deps:** cleanup `package.json` ([6a078dc](https://github.com/prismicio/slice-machine-plugin/commit/6a078dce2b2b7f7a3f262e94d335bb4203cb19dd))
* **deps:** fix package lock ([f4801d8](https://github.com/prismicio/slice-machine-plugin/commit/f4801d81dd18844254ffdc0c8eeea0dd3c4b70b0))
* **deps:** maintain dependencies ([6dda751](https://github.com/prismicio/slice-machine-plugin/commit/6dda75128765ee89527dd3cb3e655f7ff2551601))
* **deps:** maintain dependencies ([cdd6225](https://github.com/prismicio/slice-machine-plugin/commit/cdd62250311259c9b9b22acbc36b53b23d8900a5))
* don't export `createSliceMachineHookSystem()` ([0d3845b](https://github.com/prismicio/slice-machine-plugin/commit/0d3845bea2249cb736c0387a61081fa78379dbae))
* exploration day 1+2 ([947059d](https://github.com/prismicio/slice-machine-plugin/commit/947059d840bfc589d0c1ba62263c2b584611cd4d))
* exploration day 3 ([0417ec4](https://github.com/prismicio/slice-machine-plugin/commit/0417ec44a3c78042c7560d5ec6df397e9591136c))
* filter non-json preventively ([80d4c52](https://github.com/prismicio/slice-machine-plugin/commit/80d4c52e34f02986dbf2b2f2c4546f7078ee2099))
* forward new `hooksForType()` method ([6ddb255](https://github.com/prismicio/slice-machine-plugin/commit/6ddb255dc41e5ee09499a77399f3f3239ddba73c))
* **kit:** cleanup package ([046491f](https://github.com/prismicio/slice-machine-plugin/commit/046491f6e0a57f6082cb703516e1d4900eef2f30))
* **kit:** file casing ([7679db7](https://github.com/prismicio/slice-machine-plugin/commit/7679db7e17bb03d2fe9b5b80cabd399f5341cb97))
* remove `notify` action example ([c7e6ba4](https://github.com/prismicio/slice-machine-plugin/commit/c7e6ba47870c2a243e013d2e43e01cbfc70b6aa3))
* remove superfluous exposed methods on the runner ([1ccd7e8](https://github.com/prismicio/slice-machine-plugin/commit/1ccd7e88e7753c09bbc5920f6e1d80c602f7a330))
* remove unused code ([e4b64a0](https://github.com/prismicio/slice-machine-plugin/commit/e4b64a02572d903295331b4c725fdaacb47f400f))
* remove unused noop fn ([fd80b11](https://github.com/prismicio/slice-machine-plugin/commit/fd80b11b0d406f5ffc4ce15c0ab9043ce901e62f))
* **test-utils:** remove `test-utils` (will be merged in `kit`) ([6f18e0b](https://github.com/prismicio/slice-machine-plugin/commit/6f18e0ba8429fb95b6ed58645e4fe9731b3c07d8))
* update `@prismicio/mock` ([cab6cc5](https://github.com/prismicio/slice-machine-plugin/commit/cab6cc5384c0e701f6c498ada52def73a4faa0ee))
* update `@prismicio/types` ([57fc44f](https://github.com/prismicio/slice-machine-plugin/commit/57fc44fa3f3f1c830c0dd8ef706c724c3f36aa43))
* update imports ([1ddf81b](https://github.com/prismicio/slice-machine-plugin/commit/1ddf81b23db7bc31e0be60a357b189b7326faecf))


### Refactor

* `hook.name` > `hook.type` ([5a22f4b](https://github.com/prismicio/slice-machine-plugin/commit/5a22f4bae3eb09083dcb3a793a97d149cecadfad))
* `HookSystem` ID generation ([065e638](https://github.com/prismicio/slice-machine-plugin/commit/065e6388fdf136b1e458eb23d754c82a536f9b77))
* `library:read` hooks ([a57d257](https://github.com/prismicio/slice-machine-plugin/commit/a57d2573273085694c1fdeed2b75bee692925f38))
* **adapter-next:** migrate to actions/helpers ([9f5b99b](https://github.com/prismicio/slice-machine-plugin/commit/9f5b99bec84eac778e6842076a54812eeaef10ac))
* change hook names ([68ebbe2](https://github.com/prismicio/slice-machine-plugin/commit/68ebbe2b10768ba653a5395153011a21e23b6778))
* hook meta types ([b7419cf](https://github.com/prismicio/slice-machine-plugin/commit/b7419cf836f80fb627b988a8eaaf72a789ee7c81))
* hook return type ([a19b567](https://github.com/prismicio/slice-machine-plugin/commit/a19b567c20232c07d150757752cfbdcb7fb34972))
* **kit:** `ui:notification` data as object ([cb0500b](https://github.com/prismicio/slice-machine-plugin/commit/cb0500b6d0ee9e1e81dfe59f6cd01238655690e5))
* **kit:** add `HookSystem` class ([101ac16](https://github.com/prismicio/slice-machine-plugin/commit/101ac1673b66d2eaca8a4e9c335244196b0fdf26))
* **kit:** returns hook as array ([f6f5919](https://github.com/prismicio/slice-machine-plugin/commit/f6f5919ebfd728ceb779a817a5f505989946fca9))
* merge actions under context and introduce helpers ([4b9004f](https://github.com/prismicio/slice-machine-plugin/commit/4b9004fea38365a62339ba86f4c5432834f65eee))
* more explcit `setup` actions type ([c38f2af](https://github.com/prismicio/slice-machine-plugin/commit/c38f2af5d9d15a9fbb380ceaedd92bfab75f2974))
* rely consistently on `plugin.meta.name` ([e01626e](https://github.com/prismicio/slice-machine-plugin/commit/e01626e9ad4e64d3ba1c2c4ef7cbedaafb394331))
* simplify HookSystem with typed meta ([1a53cbf](https://github.com/prismicio/slice-machine-plugin/commit/1a53cbf85a4db9bc7e81d01dec465802a5174881))
* unnest `hook` and `unhook` from `actions` in plugin setup ([e44607d](https://github.com/prismicio/slice-machine-plugin/commit/e44607d5a7fe2458ab111a07c0d38a312d61dd63))
* update exposed types ([e10a780](https://github.com/prismicio/slice-machine-plugin/commit/e10a780e78d8637140d9ef14a0504f19d9e6a3b2))
* use `Hook` type to define `SliceMachineHooks` ([fc1dd45](https://github.com/prismicio/slice-machine-plugin/commit/fc1dd4559210cc16895ee2ef179d713b6626f734))


### Documentation

* update docs ([1604788](https://github.com/prismicio/slice-machine-plugin/commit/160478883afe7829b4d9dd6e12b737165a94a50d))
* update kit README and description ([8c857bd](https://github.com/prismicio/slice-machine-plugin/commit/8c857bd0311969b312bec0ec0442f444e0cb3e55))
