import { test, expect } from "vitest";
import { createMockFactory } from "@prismicio/mock";
import {
	SnippetDescriptor,
	SnippetReadHookDataRootModelType,
} from "@slicemachine/plugin-kit";
import prettier from "prettier";

/**
 * !!! DO NOT use this mock factory in tests !!!
 *
 * @remarks
 * Its seed is not specific to be used outside the most general cases.
 */
const mock = createMockFactory({ seed: import.meta.url });

// Slice model to be used in general tests.
const model = mock.model.customType({
	fields: {
		boolean: mock.model.boolean(),
		color: mock.model.color(),
		contentRelationship: mock.model.contentRelationship(),
		date: mock.model.date(),
		embed: mock.model.embed(),
		geoPoint: mock.model.geoPoint(),
		group: mock.model.group(),
		image: mock.model.image(),
		integrationFields: mock.model.integrationFields(),
		keyText: mock.model.keyText(),
		link: mock.model.link(),
		linkToMedia: mock.model.linkToMedia(),
		number: mock.model.number(),
		richText: mock.model.richText(),
		select: mock.model.select(),
		sliceZone: mock.model.sliceZone(),
		timestamp: mock.model.timestamp(),
		title: mock.model.title(),
		uid: mock.model.uid(),
	},
});

const testSnippet = (
	fieldName: keyof typeof model.json.Main,
	expected: string | SnippetDescriptor[],
) => {
	test(fieldName, async (ctx) => {
		const {
			data: [res],
		} = await ctx.pluginRunner.callHook("snippet:read", {
			fieldPath: [model.id, "data", fieldName],
			model: model.json.Main[fieldName],
			rootModel: model,
			rootModelType: SnippetReadHookDataRootModelType.CustomType,
		});

		if (Array.isArray(expected)) {
			expect(res).toStrictEqual(
				expected.map((descriptor) => ({
					...descriptor,
					code: prettier.format(descriptor.code, { parser: "typescript" }),
				})),
			);
		} else {
			expect(res).toStrictEqual({
				label: "React",
				language: "tsx",
				code: prettier.format(expected, { parser: "typescript" }),
			});
		}
	});
};

testSnippet("boolean", `<>{${model.id}.data.boolean}</>`);

testSnippet("color", `<>{${model.id}.data.color}</>`);

testSnippet(
	"contentRelationship",
	`<PrismicLink field={${model.id}.data.contentRelationship}>Link</PrismicLink>`,
);

testSnippet("date", `<>{${model.id}.data.date}</>`);

testSnippet("embed", `<>{${model.id}.data.embed}</>`);

testSnippet("geoPoint", `<>{${model.id}.data.geoPoint}</>`);

testSnippet(
	"group",
	`<>{${model.id}.data.group.map((item) => (
<>{/* Render content for item */}</>
))}</>`,
);

testSnippet("image", [
	{
		label: "React (next/image)",
		language: "tsx",
		code: `<PrismicNextImage field={${model.id}.data.image} />`,
	},
	{
		label: "React",
		language: "tsx",
		code: `<PrismicImage field={${model.id}.data.image} />`,
	},
]);

testSnippet("integrationFields", `<>{${model.id}.data.integrationFields}</>`);

testSnippet("keyText", `<>{${model.id}.data.keyText}</>`);

testSnippet(
	"link",
	`<PrismicLink field={${model.id}.data.link}>Link</PrismicLink>`,
);

testSnippet(
	"linkToMedia",
	`<PrismicLink field={${model.id}.data.linkToMedia}>Link</PrismicLink>`,
);

testSnippet("number", `<>{${model.id}.data.number}</>`);

testSnippet("richText", `<>{${model.id}.data.richText}</>`);

testSnippet("select", `<>{${model.id}.data.select}</>`);

testSnippet(
	"sliceZone",
	`<SliceZone slices={${model.id}.data.sliceZone} components={components} />`,
);

testSnippet("timestamp", `<>{${model.id}.data.timestamp}</>`);

testSnippet("title", `<>{${model.id}.data.title}</>`);

testSnippet("uid", `<>{${model.id}.data.uid}</>`);
