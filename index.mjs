import normalizeOpts from "es5-ext/object/normalize-options.js";
import resolveLength from "./lib/resolve-length.mjs";
import { default as plain, registeredExtensions } from "./plain.mjs";
import primitive from "./normalizers/primitive.mjs";
import get from "./normalizers/get.mjs";
import get1 from "./normalizers/get-1.mjs";
import getFixed from "./normalizers/get-fixed.mjs";
import getPrimitiveFixed from "./normalizers/get-primitive-fixed.mjs";

export default function memoize(fn /*, options*/) {
	var options = normalizeOpts(arguments[1]),
		length;

	if (!options.normalizer) {
		length = options.length = resolveLength(options.length, fn.length, options.async);
		if (length !== 0) {
			if (options.primitive) {
				if (length === false) {
					options.normalizer = primitive;
				} else if (length > 1) {
					options.normalizer = getPrimitiveFixed(length);
				}
			} else if (length === false) options.normalizer = get();
			else if (length === 1) options.normalizer = get1();
			else options.normalizer = getFixed(length);
		}
	}

	// Assure extensions
	if (options.async) registeredExtensions.add("async");
	if (options.promise) registeredExtensions.add("promise");
	if (options.dispose) registeredExtensions.add("dispose");
	if (options.maxAge) registeredExtensions.add("maxAge");
	if (options.max) registeredExtensions.add("max");
	if (options.refCounter) registeredExtensions.add("refCounter");

	return plain(fn, options);
}
