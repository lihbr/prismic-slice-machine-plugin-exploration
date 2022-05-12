import type { SnippetReadHook } from "@slicemachine/plugin-kit";
import * as prismicT from "@prismicio/types";

import { noopTag as tsx } from "../lib/noopTag";

import type { PluginOptions } from "../types";

const dotPath = (segments: string[]): string => {
	return segments.join(".");
};

export const snippetRead: SnippetReadHook<PluginOptions> = async (
	data,
	actions,
	_context,
) => {
	const { fieldPath } = data;

	const label = "React";

	switch (data.model.type) {
		case prismicT.CustomTypeModelFieldType.Link: {
			const code = await actions.format(tsx`
				<PrismicLink field={${dotPath(fieldPath)}}>Link</PrismicLink>
			`);

			return {
				label,
				language: "tsx",
				code,
			};
		}

		case prismicT.CustomTypeModelFieldType.Group: {
			const code = await actions.format(tsx`
				${dotPath(fieldPath)}.map(item => (
				  // Render content for item
				))
			`);

			return {
				label,
				language: "tsx",
				code,
			};
		}

		case prismicT.CustomTypeModelFieldType.Slices: {
			const code = await actions.format(tsx`
				<SliceZone
				  slices={${dotPath(fieldPath)}}
				  components={components}
				/>
			`);

			return {
				label,
				language: "tsx",
				code,
			};
		}

		default: {
			return {
				label,
				language: "tsx",
				code: dotPath(fieldPath),
			};
		}
	}
};
