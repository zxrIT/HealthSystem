import type {Plugin} from "vite";
import fastGlob from "fast-glob";

export interface IPreloadImagesOptions {
    dir: string,
    attr: {
        rel: 'preload' | 'prefetch',
    }
}

export default function preloadImages(options: IPreloadImagesOptions): Plugin {
    const {dir, attr = {}} = options;
    const assetsImages: string[] = []
    return {
        name: "vite-plugin-preloadImages",
        generateBundle(_, bundle) {
            const files = fastGlob.sync(dir)
            const value = Object.values(bundle)
            value.forEach((item) => {
                if (files.includes(Reflect.get(item, 'originalFileName'))) {
                    assetsImages.push(item.fileName)
                }
            })
        },
        transformIndexHtml(_, context) {
            let images: string[]
            if (context.server) {
                const files = fastGlob.sync(dir)
                const base = context.server?.config.base || ""
                images = files.map((file) => base + file)
            } else {
                images = assetsImages
            }
            return images.map(image => {
                return {
                    tag: "link",
                    attrs: {
                        rel: "prefetch",
                        href: image,
                        as: "image",
                        ...attr
                    }
                }
            })
        }
    }
}